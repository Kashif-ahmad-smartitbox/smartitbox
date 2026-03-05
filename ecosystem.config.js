module.exports = {
    apps: [
        {
            name: "smartitbox-frontend",
            script: "node_modules/next/dist/bin/next",
            args: "start",
            cwd: "./",
            instances: 1,
            autorestart: true,
            watch: false,
        }
    ]
}
