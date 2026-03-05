module.exports = {
    apps: [
        {
            name: "smartitbox-frontend",
            script: "node_modules/next/dist/bin/next",
            args: "start -p 3001",
            cwd: "./",
            instances: 1,
            autorestart: true,
            watch: false,
            env: {
                PORT: 3001
            }
        }
    ]
}
