$(() => {
  $('#register-btn').on('click', (evt) => {
    evt.preventDefault();
    const formData = $('#register').serialize();
    $.ajax({
      url: '/api/user/register',
      method: 'POST',
      data: formData,
      dataType: 'json',
    }).done((res) => {
      if (res.error) {
        $('#error').html(res.error);
      } else {
        $('#register').trigger('submit');
      }
    });
  });
  $('#edit').on('submit', (evt) => {
    evt.preventDefault();
    const formData = $('#edit').serialize();
    $.ajax({
      url: '/api/user/edit',
      method: 'POST',
      data: formData,
      dataType: 'json',
    }).done((res) => {
      if (res.error) {
        $('#error').html(res.error);
      } else {
        $('.hide_form').hide()
        $('#edited').html('Account has been Edited')
        $('#back_btn').show()
      }
    });
  });
  $('#add_submit').on('click', (evt) => {
    evt.preventDefault();
    const formData = new FormData($('#post').get(0));
    $.ajax({
      url: '/api/post/add',
      method: 'POST',
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false,
    }).done((res) => {
      if (res.error) {
        $('#error').html(res.error);
      } else {
        $('#post').trigger('submit');
      }
    });
  });
  $('#add_submit').on('click', (evt) => {
    evt.preventDefault();
    const formData = new FormData($('#post').get(0));
    $.ajax({
      url: '/api/post/edit',
      method: 'POST',
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false,
    }).done((res) => {
      if (res.error) {
        $('#error').html(res.error);
      } else {
        $('#post').trigger('submit');
      }
    });
  });
  $('#delete_account').on('click', (evt) => {

    
  });
});
