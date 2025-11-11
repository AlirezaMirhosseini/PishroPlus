<template>
  <svg
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <rect width="50" height="50" fill="url(#karafarin)" />
    <defs>
      <pattern id="karafarin" patternContentUnits="objectBoundingBox" width="1" height="1">
        <use xlink:href="#image0_4021_4936" transform="scale(0.00666667)" />
      </pattern>
      <image
        id="image0_4021_4936"
        width="150"
        height="150"
        xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAMAAAAL34HQAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjM4MTU5RDk0OTg5MTFFNkIwRDdBOTFEM0Y1OTkxMDYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjM4MTU5REE0OTg5MTFFNkIwRDdBOTFEM0Y1OTkxMDYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCMzgxNTlENzQ5ODkxMUU2QjBEN0E5MUQzRjU5OTEwNiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCMzgxNTlEODQ5ODkxMUU2QjBEN0E5MUQzRjU5OTEwNiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqjReLEAAAGwUExURRRxFKpzRtLk0uLu4sHawXywfHOqc4KzgmWiZW2nbYq4inSrdHuve2ymbIm4ib2Sb2+ob9zGtHmuedCyma14Tb6UcvTt5+ve09O3n/z6+GqlatvEsbKAV97Jt+rc0bSEXMTbxHetd/v599S4ocqojLaHYLiKZGikaL2TcMCXdfv49rOCWufXy1+eX7qNaNnBreHt4Wula8qni8yqj7KBWGKgYr+WdO7k21CVUHiueFqbWsWfgK55Ts/iz698UseihP38+83hzcOcfPr39b+Vc9a8pnasdmCfYF6eXu7i2cmnitXl1e/l3FycXNO2n/jz8IS1hOzg1vj08ObVyH2wffHo4d7IttrCrrqOat7JuNnArODs4O/k27eIYta7pfHn4O/l3c6ulIi3iNTl1Ojazsvgy+TTxePQwcGYd+rd0qp0R8ejhde+qdO3oPLq47qNaat1SNK1ndW5o3Kqck+VT12dXd/LuszgzPfy7t3GtIW1heLPwOXUxm6obuLPv3iteNK0nPn18c+vls2tkt3ItoCygH+yf+jZzenb0PLp4u7j2q97ULeJY8ahg/79/P///73QW0UAAACQdFJOU///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AANl54cAAAQHSURBVHja7NtlUxxBEAbgXsguYe8IDgESCITgBELc3d3d3d3dPfuXc8kdAep6pGd6jqvU9PeteqruauTtHkiKssCzPMuzPMuzPMuzPMuzPMuzPKs4WQ+WFSNrKkBUfKyMis8FrCo2F/CquFzArGJyAbeKxwXsKhYX8Ks4XOBAxeACFyp7FzhRWbvAjcrWBY5Uli5wpbJzgTOVlcuG1Q2Kap8MVgUoK114lobK3AVOVcYucKsydYFjlaELXKvMXEasQSBVeWFY3UCs14Vg7dwzXEqq45s2u2c9hGHqJxehyjUrsw+ep34zCyDllvVndy6hsqYA1QV0lRmL5gK6Cme9PfPl0ovW031CFskFdBXCulpbuSL4W6t6Zy8WsCguoKvyWNVHgglV/wpnEVwEVjOgrIGuIK/qt6IsqOFnlQPKOhugdQplQcjNGlONZ3X0BIL6ibJ0XUBXjWOtnxMIawPK0nQBXTWO1RVIah3K0nMBXTXGWh5I6y7K0nIBXfWP9ShQ1F6UpeMCumqU1XFHxerHWRouoKtGWe8CZR3CWWoX0FU5Vp9aFcwQsJQuoKtyrBYNVnBBwFK5gK7KsSp1WCMilsIFdFWWtU9HFSwQsuQuoKuyrAEtVnBLyJK6gK7Ksm7osfaLWTIX0FVZ1ns91pCEJXFJWEtAxhrRY02XsWChAWuLlLWNg1Vl8iOGMlanHuuejBWb/eVDCatWjzVTwopNF4hQzPqgx2oVs2Lz5TQUsr7psXYLWbHN5hOKWGu+66huC1f52G6rDkV74nUd1mwRK7Y92IQC1mcdVoOAFdsfA0PBMbBfreoVnLdi+2NgvivHuqxm7cBZSpXeFSPErxhzVarV+FlerdK8kIUoq0GhqmtCWRoq3etriN4Tj8pZjeg9UUelfdkP0Vv1LuW+k8fSUulHIyEajbwRq6rRDEJPRQiSQjRIOiZAXXuOJjaaKkrsVoPmW41oaFN5EM23zrkIKVNoGvjrZl3erfUwHlKWuYl0U3h2+mTjhBWsp6UJz071VcQAPCUKwE8MdS462db248r8p19FAThBRW0XpMzbBRQVubmSMmWRVPRWVMa13aAVRVMZNO7mQSn1k8dwwHXjLuNaurKEVGsrqO1Eo6bwS2pT+FNSCFZyn6b6mBSGlaQpqmlJoVgUl4nKeJgl7VRlPvqTdqmyGJRKO1TZjJWl3amshvDaVapnyWSwkkiuKksmhyV3Wahsx2EjNyrr4eHIicp+1DpyoWIYTI8cqDjG+CN+Fcujh4hdxfNEJOJWMT2oiZhVXM+PIl4V22OtiFXF97Qt4lQxPgSMGFWczyYjPhXrI9PB5qQYWYzlWZ7lWZ7lWZ7lWZ7lWZ7lWZ7lWZ7lWf8Z67cAAwDUj3TumE9HjgAAAABJRU5ErkJggg=="
      />
    </defs>
  </svg>
</template>
