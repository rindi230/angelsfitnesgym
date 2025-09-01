warning: in the working copy of 'vite.config.ts', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/vite.config.ts b/vite.config.ts[m
[1mindex 0533ec8..17b7c26 100644[m
[1m--- a/vite.config.ts[m
[1m+++ b/vite.config.ts[m
[36m@@ -4,7 +4,7 @@[m [mimport path from "path";[m
 [m
 // https://vitejs.dev/config/[m
 export default defineConfig(({ mode }) => ({[m
[31m-  base: mode === 'production' ? "/angelsfitnessgymm/" : "/", // <-- THIS SHOULD MATCH YOUR REPO NAME![m
[32m+[m[32m  base: mode === 'production' ? "/angelsfitnessgymm/" : "/", // <-- THIS SHOULD MATCH YOUR REPO NAME!image.png[m
   server: {[m
     host: "::",[m
     port: 8082,[m
