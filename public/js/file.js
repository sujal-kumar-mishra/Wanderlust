let inputFile = document.querySelector('input[type="file"]');

if(inputFile){
   inputFile.addEventListener('change',function(e){
    
    let invalidFile = document.querySelector('.file');
    
    if(e.target.files.length > 3){
        invalidFile.setAttribute('style', 'display:block;');
        inputFile.value = '';
    }

    setTimeout(function () {
        invalidFile.setAttribute('style', 'display:none;');
    }, 5000);
    
    }); 
}
