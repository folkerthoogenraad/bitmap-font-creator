export let PWA = {
    isBrowser: false,
    launchFiles: [] as File[],

    onLaunchFilesLoaded: (files: File[]) => {},
};

export function initPWA(){
    PWA.isBrowser = matchMedia("(display-mode: browser)").matches;

    if (!PWA.isBrowser) {
        console.log("Running as a standalone app.");
        window.resizeTo(768, 512 + 24); // heading is 24 pixels high
        document.title = "";
    }
    else{
        console.log("Running as a browser.");
    }

    if ('launchQueue' in window) {
        console.log('File Handling API is supported!');
    
        let launchQueue = (window as any).launchQueue;

        launchQueue.setConsumer(async (launchParams: any) => {
            PWA.launchFiles = [];
            
            for (const file of launchParams.files) {
                const f = await file.getFile() as File;
                
                PWA.launchFiles.push(f);
            }
            
            PWA.onLaunchFilesLoaded(PWA.launchFiles);
        });
    }

    window.addEventListener("resize", () => {
        PWA.isBrowser = matchMedia("(display-mode: browser)").matches;
    });
}

export function readFileAsync(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onload = (data) => {
        let result = reader.result;
        if(typeof result === "string"){
            resolve(result);
        }
        reject("File is not a string");
        }
        reader.onerror = reject;
        reader.onabort = reject;

        reader.readAsDataURL(file);

    });
}
export function loadImageAsync(source: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        let image = new Image();
        image.onerror = reject;
        image.onload = () => resolve(image);
        image.src = source;
    });
}