<template>
    <div _ngcontent-c55="" class="barcode" tabindex="0"><div _ngcontent-c55=""></div></div>
</template>
<style  scoped>
.barcode[_ngcontent-c55] {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABiCAMAAAAiAWwkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRF////AAAAVcLTfgAAAI1JREFUeNrsz0sOgCAMQEF6/0sbUWzrysh2XuIXUp0xJEnaL+I6zvO8rod8FXd1c1nqc9rmsv81dzxD2vdzOe/nnPW1/ssgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAfIZIk/ekQYAA9JB5vsOMadgAAAABJRU5ErkJggg==);
    background-color: #fff;
    background-repeat: no-repeat;
    background-position: center center;
    width: 90%;
    height: 98px;
 margin: 0 auto;} 
  
    @keyframes move-laser {
        0%{
            transform: translateY(20px);
        }
        100%{
            transform: translateY(78px);
        }
    }
    .barcode[_ngcontent-c55] div[_ngcontent-c55] {
    background: #f03;
    height: 2px;
    box-shadow: 0 0 4px 3px rgba(255, 0, 51, .4);
    margin: 0 15px;
    -webkit-animation: 2s ease-in-out infinite alternate  move-laser;
    animation: 2s ease-in-out infinite alternate  move-laser;
}
</style>
    
