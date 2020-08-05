import React, { useEffect } from "react";

const Visualisation = (props) => {
  useEffect(() => {
    const renderVisualisation = () => {
      // Add compatibility check for Safari
      let AudioContext = window.AudioContext || window.webkitAudioContext;
      let context = new AudioContext();

      let src = context.createMediaElementSource(props.audio);
      let analyser = context.createAnalyser();

      src.connect(analyser);
      analyser.connect(context.destination);

      analyser.fftSize = 32;

      let bufferLength = analyser.frequencyBinCount;

      let dataArray = new Uint8Array(bufferLength);

      const renderFrame = () => {
        requestAnimationFrame(renderFrame);
        let canvas = document.getElementById("canvas");
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        let ctx = canvas.getContext("2d");

        let WIDTH = canvas.width;
        let HEIGHT = canvas.height;

        let barWidth = WIDTH / bufferLength;
        let barHeight;
        let x = 0;

        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = "transparent";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i];

          var r = barHeight + 25 * (i / bufferLength);
          var g = 250 * (i / bufferLength);
          var b = 50;

          ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
          ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

          x += barWidth + 1;
        }
      };
      renderFrame();
      document.documentElement.addEventListener("mousedown", function () {
        if (context.state !== "running") {
          console.log("AudioContext starting due to user input");
          context.resume();
        }
      });
    };
    renderVisualisation();
  }, [props.audio]);

  return <canvas id='canvas'></canvas>;
};

export default Visualisation;
