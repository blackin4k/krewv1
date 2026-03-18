const timecut = require('timecut');
const path = require('path');
const ffmpegPath = require('ffmpeg-static');
const { exec } = require('child_process');
const fs = require('fs');

const CONFIG = {
    url: 'file://' + path.join(__dirname, 'reel-sequence.html'),
    viewport: {
        width: 1080,
        height: 1920
    },
    selector: 'body', // Capture the whole body
    fps: 60,          // Smooth 60 FPS
    duration: 9,      // 9 seconds to match tight timeline
    output: 'krew_reel.mp4',
    ffmpegPath: ffmpegPath,
    launchArguments: ['--no-sandbox', '--disable-setuid-sandbox'],
    keepFrames: true
};

console.log(`Starting video export...`);
console.log(`Target: ${CONFIG.url}`);
console.log(`Output: ${CONFIG.output}`);
console.log(`Duration: ${CONFIG.duration}s @ ${CONFIG.fps} FPS`);

timecut(CONFIG).then(() => {
    console.log('Capture complete. Stitching video manually...');

    // Find the frames directory
    const files = fs.readdirSync(__dirname);
    const framesDir = files.find(f => f.startsWith('timecut-frames-'));

    if (framesDir) {
        const ffmpegCmd = `"${ffmpegPath}" -framerate 60 -i "${framesDir}/image-%09d.png" -c:v libx264 -pix_fmt yuv420p -y krew_reel.mp4`;

        exec(ffmpegCmd, (error, stdout, stderr) => {
            if (error) {
                console.error(`Stitching failed: ${error.message}`);
                return;
            }
            console.log('Export completed successfully: krew_reel.mp4');

            // Optional: Cleanup frames
            // fs.rmSync(framesDir, { recursive: true, force: true });
        });
    } else {
        console.error('Could not find frames directory for stitching.');
    }
}).catch((err) => {
    console.error('Export failed:', err);
});
