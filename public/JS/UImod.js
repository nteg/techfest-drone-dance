function allowrecording() {
    $('#recording').addClass('micanimate');
}

function showControl() {
    $('.blankbar').show();
    $('.chapterbar').show();
    $('.controlbar').show();
}

function hideControl() {
    $('.chapterbar').hide();
    $('.controlbar').hide();
    $('.chapter').hide();
    $('.blankbar').hide();
}

$(document).ready(function () {
    $('.techfestbar').click(function () {
        if ($(this).hasClass('techfestbarexpanded')) {
            $(this).animate({ "height": "40px" }, 500, 'swing', showControl);
            $('#pagetitle').animate({ 'font-size': '24px', 'margin-top': '0' }, 500);
            $('#topdiv').animate({ 'height': '0' }, 500);
            $(this).removeClass('techfestbarexpanded');
        } else {
            hideControl();
            var hght = $(window).height();
            $(this).animate({ 'height': hght.toString() }, 500, 'swing');
            $('#pagetitle').animate({ 'font-size': '64px' }, 500);
            $('#topdiv').animate({ 'height': '300px' }, 500);
            $(this).addClass('techfestbarexpanded');
        }
    });

    $('#chapterselection1').click(function () {
        $('#chapter2').hide();
        $('#chapter3').hide();
        $('#chapter1').show().effect('slide', { direction: 'up', distance: '-500' }, 300, allowrecording);
        $('.controlbar').css('background-color', '#FFAB7B');
    });
    $('#chapterselection2').click(function () {
        $('#chapter3').hide();
        $('#recording').removeClass('micanimate');
        $('#chapter1').hide();
        $('#chapter2').show().effect('slide', { direction: 'up', distance: '-500' }, 300);
        $('.controlbar').css('background-color', '#D0E8FF');
    });
    $('#chapterselection3').click(function () {
        $('#chapter2').hide();
        $('#recording').removeClass('micanimate');
        $('#chapter1').hide();

        $('#chapter3').show().effect('slide', { direction: 'up', distance: '-500' }, 300);
        $('.controlbar').css('background-color', '#CDFFC2');
    });

    $('#lyricsinput').click(function () {
        $('#fileinput').click();
    });

    $('#fileinput').change(function () {
        var name = $(this).val().split('\\');
        $('#lyricsinput').val(name[name.length-1]);
    });
});