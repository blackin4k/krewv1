const timecut = require('timecut');
const path = require('path');
const ffmpegPath = require('ffmpeg-static');
const { exec } = require('child_process');
const fs = require('fs');

// Configuration for New Reel (26s)
const CONFIG = {
    url: 'file://' + path.join(__dirname, 'ui-reel-final.html'),
    viewport: {
        width: 1080,
        height: 1920
    },
    selector: 'body',
    fps: 60,
    duration: 26,      // 26 seconds to capture full logo reveal
    output: 'krew_reel_final.mp4',
    ffmpegPath: ffmpegPath,
    launchArguments: ['--no-sandbox', '--disable-setuid-sandbox'],
    keepFrames: true
};

console.log(`Starting Final Reel export...`);
console.log(`Target: ${CONFIG.url}`);
console.log(`Output: ${CONFIG.output}`);
console.log(`Duration: ${CONFIG.duration}s @ ${CONFIG.fps} FPS`);

timecut(CONFIG).then(() => {
    console.log('Capture complete. Stitching video with ffmpeg...');

    // Find the latest frames directory
    const files = fs.readdirSync(__dirname);
    const framesDirs = files
        .filter(f => f.startsWith('timecut-frames-'))
        .map(f => ({ name: f, time: fs.statSync(path.join(__dirname, f)).mtime.getTime() }))
        .sort((a, b) => b.time - a.time);

    if (framesDirs.length > 0) {
        const framesDir = framesDirs[0].name;
        console.log(`Processing frames from: ${framesDir}`);

        const ffmpegCmd = `"${ffmpegPath}" -framerate 60 -i "${framesDir}/image-%09d.png" -c:v libx264 -pix_fmt yuv420p -crf 18 -y ${CONFIG.output}`;

        exec(ffmpegCmd, (error, stdout, stderr) => {
            if (error) {
                console.error(`Stitching failed: ${error.message}`);
                return;
            }
            console.log('Export completed successfully: ' + CONFIG.output);
        });
    } else {
        console.error('Could not find frames directory.');
    }
}).catch((err) => {
    console.error('Export failed:', err);
});
