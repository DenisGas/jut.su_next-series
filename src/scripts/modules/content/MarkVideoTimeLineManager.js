// MarkVideoTimeLineManager.js
import BaseManager from './BaseManager.js';

class MarkVideoTimeLineManager extends BaseManager {
  #videoElement;

  #videoData = {};

  constructor(videoElement, videoData) {
    super();
    this.#videoElement = videoElement;
    this.#videoData = videoData;
  }

  markVideoTimeLine() {
    this.disable();
    if (
      !this.#videoElement ||
      !this.#videoData ||
      Object.keys(this.#videoData).length === 0
    ) {
      console.log('No video element or data available.');
      return;
    }

    const progressHolder = document.querySelector(
      '.vjs-progress-holder.vjs-slider.vjs-slider-horizontal'
    );
    if (!progressHolder) {
      console.log('No progress holder found.');
      return;
    }

    const segments = [
      {
        id: 'intro',
        start: parseInt(this.#videoData.video_intro_start, 10),
        end: parseInt(this.#videoData.video_intro_end, 10),
        color: 'yellow',
      },
      {
        id: 'outro',
        start: parseInt(this.#videoData.video_outro_start, 10),
        // end: parseInt(this.#videoData.this_video_duration),
        end: parseInt(this.#videoData.video_outro_start, 10),
        color: 'red',
      },
    ];

    segments.forEach((segment) => {
      if (
        typeof segment.start !== 'number' ||
        typeof segment.end !== 'number' ||
        Number.isNaN(segment.start) ||
        Number.isNaN(segment.end) ||
        segment.end < segment.start
      ) {
        console.log(`Skipping invalid segment: ${segment.id}`);
        return;
      }

      const existingLine = document.getElementById(segment.id);
      if (existingLine) return;

      const markLine = document.createElement('div');
      markLine.id = segment.id;
      markLine.className = 'mark-line';
      markLine.style.position = 'absolute';
      markLine.style.width = '4px';
      if (segment.end - segment.start !== 0) {
        markLine.style.width = `${
          ((segment.end - segment.start) /
            parseInt(this.#videoData.this_video_duration, 10)) *
          100
        }%`;
      }
      markLine.style.height = '100%';
      markLine.style.left = `${
        (segment.start / parseInt(this.#videoData.this_video_duration, 10)) *
        100
      }%`;
      markLine.style.background = `${segment.color}`;

      progressHolder.appendChild(markLine);
    });
  }

  update() {
    this.disable();
  }

  disable() {
    document.querySelectorAll('.mark-line').forEach((mark) => mark.remove());
  }
}

export default MarkVideoTimeLineManager;
