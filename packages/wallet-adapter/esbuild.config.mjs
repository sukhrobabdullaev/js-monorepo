import esbuild from 'esbuild'
import { glob } from 'glob'
import fs from 'fs'
import path from 'path'

const globalName = 'nearWalletAdapter'

// Get all package.json files in the packages directory
const getWorkspacePackages = () => {
  const packagesDir = path.resolve('../../packages')
  const packages = new Map()

  if (fs.existsSync(packagesDir)) {
    const dirs = fs.readdirSync(packagesDir)
    dirs.forEach(dir => {
      const pkgPath = path.join(packagesDir, dir, 'package.json')
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
        packages.set(pkg.name, path.join(packagesDir, dir))
      }
    })
  }

  return packages
}

const workspacePackages = getWorkspacePackages()

const mainEntry = 'src/index.ts'
const allEntryPoints = glob.sync('src/**/*.ts').filter(file =>
  !file.includes('.test.') && !file.includes('.spec.')
)

const formats = {
  esm: {
    outdir: './dist/esm',
    tsconfig: 'tsconfig.esm.json',
    format: 'esm',
    platform: 'browser',
    entryPoints: allEntryPoints,
    bundle: true,
    splitting: true,
    packages: 'external'
  },
  cjs: {
    outdir: './dist/cjs',
    tsconfig: 'tsconfig.cjs.json',
    format: 'cjs',
    platform: 'node',
    entryPoints: allEntryPoints,
    bundle: true,
    packages: 'external'
  },
  umd: {
    outdir: './dist/umd',
    tsconfig: 'tsconfig.cjs.json',
    format: 'iife',
    platform: 'browser',
    globalName,
    entryPoints: [mainEntry],
    bundle: true,
    loader: {
      '.ts': 'ts'
    },
    resolveExtensions: ['.ts', '.js'],
    mainFields: ['browser', 'module', 'main']
  }
}

const commonOptions = {
  sourcemap: true,
  sourcesContent: true,
  minify: false,
  metafile: true,
  logLevel: 'info',
  banner: {
    js: '/* ⋈ 🏃🏻💨 FastNEAR API - https://github.com/fastnear */'
  },
  plugins: [{
    name: 'workspace-resolver',
    setup(build) {
      build.onResolve({ filter: /@fastnear\// }, args => {
        const pkgPath = workspacePackages.get(args.path)
        if (pkgPath) {
          // Read the package's package.json to find the entry point
          const pkg = JSON.parse(fs.readFileSync(path.join(pkgPath, 'package.json'), 'utf-8'))
          const entryPoint = pkg.module || pkg.main || 'src/index.ts'
          return {
            path: path.resolve(pkgPath, entryPoint)
          }
        }
        return null
      })
    }
  }]
}

// Build for each format
for (const [formatName, formatOptions] of Object.entries(formats)) {
  const options = {
    ...commonOptions,
    ...formatOptions,
  }

  esbuild.build(options)
    .then(result => {
      // uncomment for helpful debugging
      /*
      if (result.metafile) {
        console.log(`\n${formatName} build:`)
        console.log('Workspace packages found:', Array.from(workspacePackages.keys()))
        Object.entries(result.metafile.inputs).forEach(([file, info]) => {
          const imports = info.imports.map(imp => imp.path)
          if (imports.length > 0) {
            console.log(`${file} imports:`, imports)
          }
        })

      }
       */
    })
    .catch((error) => {
      console.error('Build failed:', error)
      process.exit(1)
    })
}
