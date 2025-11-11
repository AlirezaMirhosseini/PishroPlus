<template>
  <svg
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <rect width="50" height="50" fill="url(#saderat)" />
    <defs>
      <pattern id="saderat" patternContentUnits="objectBoundingBox" width="1" height="1">
        <use xlink:href="#image0_4021_5002" transform="scale(0.00666667)" />
      </pattern>
      <image
        id="image0_4021_5002"
        width="150"
        height="150"
        xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAMAAAAL34HQAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NUI5NzgyRDU0OTg4MTFFNjgwQzM5Njc2QTI1REZBQjciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NUI5NzgyRDY0OTg4MTFFNjgwQzM5Njc2QTI1REZBQjciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1Qjk3ODJEMzQ5ODgxMUU2ODBDMzk2NzZBMjVERkFCNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1Qjk3ODJENDQ5ODgxMUU2ODBDMzk2NzZBMjVERkFCNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PitNDx4AAAH+UExURSkWbzQidm9inlpLkHZqoz8ufn1xp9PP4rOtzDEedCwacezq8vTz+F5Qk7my0HJloEQzgaKawFBBimBSlDMhdlVGjDspe3Bkn4R5rOnn8Ojm8N7b6ZOJto6Es+bk7isYcIl+r5+Xv0o6hc3I3aqjxnVooqefxGJUlTAddGRWl/r6/F9Qk+Ph7MjE2lFCisG71TknelhJj9HN4DUjd3hspFtMkGpdm93a6E8/iGNVlpmQuvz8/XVpood8rm9jnoh9r4yCsnRnoVdIjmtenIZ7rrmz0GlbmnpupfPy9/f3+szH3VVGjUU0gllKj9PP4bGqyrewzoR6rZiPuvn5+5mQu/39/rixz7CpysvG3JyTvFNEi6ylx9rX5vj4+jsqezEfdcnF27Wvza6myOfl76OawUY2g56WvjooeoF2qkAwf/Hv9fz7/Xxwp2xfnEEwf4uBsdDM3zwrfH90qd/c6rOszNjV5aukx0s7htvY535yqJSLt/b1+cK81k09h3pvpm1gnWVYmHltpWFTlSoXcE4+iK2lyOLf69LO4amixUk5hDYkd8O+16CYv6SbwfDv9Yp/sDYleO7t9OHe6/v6/JaNuMO91jIgddbS41tNkWpcmmdamcbB2b6407Kry+jl7/f2+evp8Z6Vva6nyVZHjc3J3i0bclBAiXNmodzZ5////093BeUAAACqdFJOU/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AtQnI1QAAAwRJREFUeNrs23VTG2EQBvBLIAIJJEEiJEBwL5TiUKDFpTjU3d1dqLu7u+237HSmAsPdvp1p5naZ2f0ze8/mB2GG3M69GrAsTVjCEpawhCUsYQlLWMISlrCEJax5zbJZ8LIb5K6ORMt0st6e5NJYsDRFdehkmiszlxonbO1r/p9lUbDi5yRutSSofhZ7hsmskK9W+4dKaDKXVT7V7+p1hxzO6DI8l5pl8of4uxw1aDBtAw0LoDodjTqJWAAFaDaZigUBNFxBxYIFWPjLeypWBpo+TsWCxWi8iYpV+hTNlxOxwI7mu6lYefiAw0Qs8KIDrFSsVHyCm4gVh08Y5sl6wZO1fpwlS8vjybrDk3WPJ+sCT1YrT9Y0T5ZVWMKax6w+t3ucGSvs86RUWSzr0nuOvWXDcjbOeDnRU8mCVfF1zk6mnp4V1OvlELN2Fxls/WhZhpvSb5Ssi8btTjpWBOt30bCWwEO0nwiwkIB1DpLwCzJJWBMu1bL7dICA9eGUirWpjYAVGFCxXrYSsG4mqljF2wlYMShhCUtYwjKVddmveldvCgErulfFCh4iYPleq1hDOwhY+0HxT3ErNJJ8O53AL1gBnwhYLQA2rF9GdotxFHusoJfuhuyjcbua8va10Kj7inYHMXxJr+fvp16NnNB5pMb6gMF+63ru7EbcFJNtoLP7z8X+gieMdqe7DrwZi0RWjjzrk02zsJSsNJ6sRTxZO3myBnmyVvFkdfBkZfJkdfFk3eXJUu23qVhb8Jk1RKwQPvMkEQvq0JkNVKwwPrSeiAXn0aHtVCz8seTid0QsyEGnjlKx4Dk6NkzFWnsfG7tvkogF37OxuUlULLiGugayiFjgQL/UJ+QTsWAzeqpCy9329zfWbCJLdXxBy67d83j1xitjo4UuU1lwRrX4/1lVQcekuSyA5TfwdxhsGzL5b+tXJXuMjvnZ6m5/1o2cVbBKYsACcB2xpx+cdUTT1lDSme94ZBQoUhwIjY8Jy7wSlrCEJSxhCUtYwhKWsIQlLGEJa2b9EGAAsvnexs9MuigAAAAASUVORK5CYII="
      />
    </defs>
  </svg>
</template>
