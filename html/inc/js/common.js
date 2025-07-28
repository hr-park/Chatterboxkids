function gnbOpen(){
  $('.gnb_side_menu').addClass('open');
  $('.gnb_dim').show();
  $('body').css('overflow', 'hidden'); // 스크롤 방지
}

function gnbClose(){
  $('.gnb_side_menu').removeClass('open');
  $('.gnb_dim').hide();
  $('body').css('overflow', '');
}

function winTop(){
  window.scrollTo({ top: 0, behavior: "smooth" });
}