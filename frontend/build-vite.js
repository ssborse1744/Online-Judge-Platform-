
    #!/usr/bin/env node
    const { build } = require('vite');
    
    build({ 
      root: process.cwd(),
      logLevel: 'info',
      mode: 'production',
      configFile: './vite.config.js'
    }).catch((err) => {
      console.error(err);
      process.exit(1);
    });
  