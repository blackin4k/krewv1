const timecut = require('timecut');
const path = require('path');
const ffmpegPath = require('ffmpeg-static');
const { exec } = require('child_process');
const fs = require('fs');

// Configuration for 30s Ad Reel
const CONFIG = {
    url: 'file://' + path.join(__dirname, 'ad-reel-30s.html'),
    viewport: {
        width: 1080,
        height: 1920
    },
    selector: 'body',
    fps: 60,
    duration: 30,      // 30 seconds
    output: 'krew_ad_reel_30s.mp4',
    ffmpegPath: ffmpegPath,
    launchArguments: ['--no-sandbox', '--disable-setuid-sandbox'],
    keepFrames: true   // Keep frames for manual stitching if needed
};

console.log(`Starting 30s Ad Reel export...`);
console.log(`Target: ${CONFIG.url}`);
console.log(`Output: ${CONFIG.output}`);
console.log(`Duration: ${CONFIG.duration}s @ ${CONFIG.fps} FPS`);

timecut(CONFIG).then(() => {
    console.log('Capture complete. Stitching video manually with ffmpeg...');

    // Find the frames directory (timecut-frames-*)
    const files = fs.readdirSync(__dirname);
    // Sort by modification time to get the latest one
    const framesDirs = files
        .filter(f => f.startsWith('timecut-frames-'))
        .map(f => ({ name: f, time: fs.statSync(path.join(__dirname, f)).mtime.getTime() }))
        .sort((a, b) => b.time - a.time);

    if (framesDirs.length > 0) {
        const framesDir = framesDirs[0].name;
        console.log(`Using frames directory: ${framesDir}`);

        // Construct ffmpeg command
        // Note: adjusting crf for quality vs size, 23 is default, 18 is visually lossless
        const ffmpegCmd = `"${ffmpegPath}" -framerate 60 -i "${framesDir}/image-%09d.png" -c:v libx264 -pix_fmt yuv420p -crf 18 -y ${CONFIG.output}`;

        exec(ffmpegCmd, (error, stdout, stderr) => {
            if (error) {
                console.error(`Stitching failed: ${error.message}`);
                return;
            }
            console.log('Export completed successfully: ' + CONFIG.output);

            // Cleanup frames if successful
            // console.log('Cleaning up frames...');
            // fs.rmSync(framesDir, { recursive: true, force: true });
        });
    } else {
        console.error('Could not find frames directory for stitching.');
    }
}).catch((err) => {
    console.error('Export failed:', err);
});
