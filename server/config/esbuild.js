const {build} = require("esbuild")

build({
    entryPoints:['app.ts'],
    minify:true,
    platform:'node',
    bundle:true,
    outfile:'dist/build.js',
    external:['sharp','yamlparser','request'],
}).then(()=>console.log("build success"))
.catch((err)=>{
    console.log(err);
    process.exit(1);
})