
$(function(){
  $("#drag-and-drop-zone").dmUploader({
    url: '/upload.php',
    //... More settings here...

    onInit: function(){
      console.log('Callback: Plugin initialized');
    },
    onDragEnter: function(){
      // Happens when dragging something over the DnD area
      this.addClass('active');
    },
    onDragLeave: function(){
      // Happens when dragging something OUT of the DnD area
      this.removeClass('active');
    }
    // ... More callbacks
  });
});
