/**
 * Git.ts
 *
 * Utilities around Git
 */

import { exec, execSync } from "child_process"
import * as Q from "q"

interface IExecOptions {
    cwd?: string
}

export function isGitRepository(): Q.Promise<any> {
    const deferred = Q.defer<boolean>()

    exec("git log --oneline -n1", (err: any) => {
        if (err && err.code) {
            deferred.resolve(false)
        } else {
            deferred.resolve(true)
        }
    })

    return deferred.promise
}

export function getTrackedFiles(): Q.Promise<string[]> {
    const trackedFiles = execSync("git ls-files").toString("utf8").split("\n")
    return Q.resolve(trackedFiles)
}

export function getUntrackedFiles(exclude: string[]): Q.Promise<string[]> {
    let cmd = "git ls-files --others --exclude-standard" + exclude.map((dir) => " -x " + dir).join("")
    const untrackedFiles = execSync(cmd).toString("utf8").split("\n")
    return Q.resolve(untrackedFiles)
}

export function getBranch(path?: string): Q.Promise<string> {
        const options: IExecOptions = {}
        if (path) {
            options.cwd = path
        }

        const deferred = Q.defer<string>()
        exec("git rev-parse --abbrev-ref HEAD", options, (error: any, stdout: string, stderr: string) => {
            if (error && error.code) {
                deferred.reject(new Error(stderr))
            } else {
                deferred.resolve(stdout)
            }
        })
        return deferred.promise
    };
