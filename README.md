# Initialize App
## Install of NPM Modules, Required once
```npm install```

## Install of Ionic Plugins, Required once
```ionic state restore```



---------------------------------
# Angular2 Startup
```npm start```

## Angular2 Build
To Compile everything into dist/ for distro
```npm run build```



---------------------------------
# Ionic2 Startup
```npm run ionic-serve```


## Ionic2 Build
Compiles everything into www/
```npm run ionic-build```

*ionic-build has same Switches as ionic-serve


---------------------------------
### Node Server Startup
* Copy backend/sample.env to backend/.env and fixup any environment variables
```cd backend && node server.js```


---------------------------------
## Config Updates
Set defaults, localhost:3080 for backend services
```gulp configs```

### Additional gulp config switches
--release
Sets debugging to false

--host localhost:3080
Sets Madame Server / Socket Host


---------------------------------
## Update NPM Modules
```npm update```


