<template>
  <svg
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <rect width="50" height="50" fill="url(#maskan)" />
    <defs>
      <pattern id="maskan" patternContentUnits="objectBoundingBox" width="1" height="1">
        <use xlink:href="#image0_4021_4932" transform="scale(0.00666667)" />
      </pattern>
      <image
        id="image0_4021_4932"
        width="150"
        height="150"
        xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAMAAAAL34HQAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6N0Y5MzcwNTI0OTg5MTFFNjg3RjVEMDU5NkE5NUUzRDkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6N0Y5MzcwNTM0OTg5MTFFNjg3RjVEMDU5NkE5NUUzRDkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3RjkzNzA1MDQ5ODkxMUU2ODdGNUQwNTk2QTk1RTNEOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3RjkzNzA1MTQ5ODkxMUU2ODdGNUQwNTk2QTk1RTNEOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjszPT0AAAFiUExURfFhNvJpQP739fm9q/m6p/zh2PrJuvN0TvJxSvJoP/3p4/JtRvN8WfrFtf/9/fWMbPnAr/eki/WJaf7w7PFmPP7v6/rEs/rMvvJqQfepkvFlPPvSxf3r5f7z8PrKvPiwm/vPwvze1frHuPitlvJvSPvVyvN6VvzYzfR/Xf3s5/emjvFjOP/6+fehiPaUd/izn/749vzg2Pza0PeokPeghvvQw/SEYv3j3P7z7/3u6fzi2vi1ofWMbfR+WvWPcPvSxvitl/vNv/7u6vNyTPaeg/m/rvN1T/JvR/JtRfWTdfJsQ/aYe/3r5vN2UfFiN/SHZvSEY/FjOfiynfvUyfWOb/WPcfR+W/3n4PSGZfJqQvR/XPrIufSBX/abf/irlPm7qf7x7vm3o/SFZP759/FnPf/9/PJwSfaWev/8+/3k3PrFtveokf3t6P/+/fvTx/afhf3m3/718veqk/JnPvNzTf///8G9BbAAAAB2dFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wABYqlHAAAB1UlEQVR42uzbVW8CQRQF4IW2lMWtQHErTt3d3d3dXf9/aZrQVCjssrMzbc55npt8T5O5J7vcC5PhwAILLLDAAgsssMACCyywwALrL7PUnIJwOLUIloIjHgVYYIEFFlhggSUNy9VlKpcgqlppWQqlNO+oMrDAAgsssMACCyywwAKLOZamnUFWjZHjq6vYYikPnt/PdS+xw+ozzn6cHEsmWGA91Km/LssWN21WYCX10xY/dKWhx/L6I/n7hbkAHVZsokDxEfEPys3a79cWU8m0OuRkxXqL7oq0Yas8LOvjqbAWa36LPCt7mQvPZO76J8LqWBwVW/wtOwyEWLeWkhpJZ/KaBMtXclU6Q4KlKplVSYOl04ddrLGemoPZkfTlIUusqOkk90TNHLPBsp0FP80ZTD30WTq74fvotJmnyUpNdeab1utoseL69K+LUJNTftbCzkXh9Su0KS8rvndU3LralhmXi2UbvheySPu25WCtjpwL3fDX7jbIsnizR1z30LJOihXiovYb8aVIwsxpSbAa3CW2Nd6BehRJYIEFFlhggQUWWGCBBdZb+EZPhQRR7uIrXbDAAgsssMD63yxGfzKlGrDAAgsssMACCyywwAILLLAo5VWAAQDalzt9+V6qhgAAAABJRU5ErkJggg=="
      />
    </defs>
  </svg>
</template>
