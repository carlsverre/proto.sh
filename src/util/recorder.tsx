const MIME_TYPE = "video/webm";
const EXTENSION = ".webm";
const BITS_PER_SEC = 1000000000;

export type Recorder = {
    recorder: MediaRecorder;
    blobs: Blob[];
    fileHandle?: FileSystemFileHandle;
};

export function initRecorder(canvas: HTMLCanvasElement): Recorder {
    const r: Recorder = {
        recorder: new MediaRecorder(canvas.captureStream(), {
            mimeType: MIME_TYPE,
            videoBitsPerSecond: BITS_PER_SEC,
        }),
        blobs: [],
    };

    r.recorder.onstop = async () => {
        const fileHandle = r.fileHandle;
        if (fileHandle) {
            console.log("saving...");
            const buffer = new Blob(r.blobs, { type: MIME_TYPE });
            const stream = await fileHandle.createWritable();
            await stream.write(buffer);
            await stream.close();
            console.log("saved");
        }
    };

    r.recorder.ondataavailable = (evt: BlobEvent) => {
        if (evt.data && evt.data.size > 0) {
            r.blobs.push(evt.data);
        }
    };

    return r;
}

export async function startRecording(recorder: Recorder) {
    recorder.blobs = [];
    recorder.recorder.start(100);
    console.log("recording started");

    recorder.fileHandle = await window.showSaveFilePicker({
        excludeAcceptAllOption: true,
        types: [
            {
                description: "Video file",
                accept: { [MIME_TYPE]: [EXTENSION] },
            },
        ],
    });
}

export async function stopRecording(recorder: Recorder) {
    recorder.recorder.stop();
    console.log("recording stopped");
}
