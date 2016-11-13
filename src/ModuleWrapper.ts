import { Config } from "./Config";
import * as path from "path";
import * as fs from "fs";


/**
 *
 *
 * @export
 * @class ModuleWrapper
 */
export class ModuleWrapper {

    public static wrapFinal(contents: string, entryPoint: string, standalone: boolean) {
        let file = path.join(Config.ASSETS_DIR, standalone ? "fusebox.min.js" : "local.js");
        let wrapper = fs.readFileSync(file).toString();
        if (entryPoint) {
            let entryJS = `FuseBox.import("${entryPoint}")`;
            wrapper = wrapper.split("window.entry").join(entryJS);
        }
        wrapper = wrapper.split("window.contents").join(contents);
        return wrapper;
    }

    public static wrapModule(name: string, conflictingVersions: Map<string, string>, content: string, entry?: string) {
        let conflictingSource = {};
        conflictingVersions.forEach((version, libname) => {
            conflictingSource[libname] = version; 
        });
        return `FuseBox.module("${name}", ${JSON.stringify(conflictingSource)}, function(___scope___){
${content}
${entry ? 'return ___scope___.entry("' + entry + '")' : ""}
})`;
    }
    /**
     *
     *
     * @static
     * @param {string} name
     * @param {string} content
     * @returns
     *
     * @memberOf ModuleWrapper
     */
    public static wrapGeneric(name: string, content: string) {
        let fn = `___scope___.file("${name}", function(exports, require, module, __filename, __dirname){
${content}
});`;
        return fn;
    }
}