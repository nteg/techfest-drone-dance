function allowrecording() {
    $('#recording').addClass('micanimate');
}

function animateCommand() {
    $('#command_span2').removeClass('lyricsanimation');
    window.setTimeout(function () { $('#command_span2').addClass('lyricsanimation'); }, 1000);
}

function animateSpeechCommand() {
    $('#command_span').removeClass('lyricsanimation');
    window.setTimeout(function () { $('#command_span').addClass('lyricsanimation'); }, 1000);
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

function pageInitial() {
    hideControl();
    var hght = $(window).height();
    $('.techfestbar').css({ 'height': hght.toString() });
    $('#pagetitle').css({ 'font-size': '64px' });
    $('#topdiv').css({ 'height': '200px' });
    $('.techfestbar').addClass('techfestbarexpanded');
}

$(document).ready(function () {
    pageInitial();

    $('.techfestbar').click(function () {
        if ($(this).hasClass('techfestbarexpanded')) {
            $('#authorBar').show().animate({ 'opacity': '0' }, 300, 'swing', function () { $(this).addClass('hide'); $(this).removeClass('show') });
            $(this).animate({ "height": "40px" }, 500, 'swing', showControl);
            $('#pagetitle').animate({ 'font-size': '24px', 'margin-top': '0' }, 500);
            $('#topdiv').animate({ 'height': '0' }, 500);
            $(this).removeClass('techfestbarexpanded');
        } else {
            hideControl();
            var hght = $(window).height();
            $('.techfestbar').animate({ 'height': hght.toString() }, 500, 'swing', function () { $('#authorBar').animate({ 'opacity': '1', }, 400, 'swing'); });
            $('#authorBar').removeClass('hide'); $(this).addClass('show');
            $('#pagetitle').animate({ 'font-size': '64px' }, 500);
            $('#topdiv').animate({ 'height': '200px' }, 500);
            $('.techfestbar').addClass('techfestbarexpanded');
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