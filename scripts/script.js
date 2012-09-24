/*
 *  The parralex
 */
(function()
{
    var windowHeight,
        windowWidth,
        windowScroll = 0;

    //jquery objects
    var $doc,
        $window,
        $main,
        $panels;
    var _verse;

    var site,           //the json objects represeting the website
        paradoxDefaultRatios = [ 1.0, 1.3, 0.5 ],
        loadedVersesCount = 0;
    
    function initGlobalVars()
    {
        $window = $(window);

        windowHeight = $(window).height();
        windowWidth = $(window).width();

        $main = $('div#main');

        _verse = _.template($('#verse-template').html());

        $.ajaxSetup(
        {
            type: 'GET',
            error: function()
            {
                for( var i = arguments.length; --i >= 0; )
                    console.log( i + ":" + arguments[i] );
            }
        });
    }
    function initDOM()
    {
        getSiteJSON();
        $main.height( windowHeight );
    }
    function initEvents()
    {
        $window.on('scroll', function()
        {
            windowScroll = $window.scrollTop();
            $panels.each(function()
            {
                if( isPanelVisible( $(this) ) )
                    animateForParadox( $(this) );           //do the paradox shit
                else
                    hideAndResetPanel( $(this) );
            });
        })
            .on('resize', function()        { windowHeight = $window.height(); windowWidth = $window.width(); });

        $doc.on('verseLoaded', function()
        {
            if( site.verses.length === ++loadedVersesCount )
                drawSite();
        });
    }
    function isPanelVisible($el)
    {
        var offset = $el.offset().top;
        return ( offset+windowHeight >= windowScroll && offset <= windowScroll + windowHeight );
    }
    function animateForParadox($panel)
    {
        //do all the animates and maths to move the elements inside of this div  in a illusion
        var panelOffset = $panel.offset().top,
            denominator = windowHeight * 2,
            numerator = windowScroll+windowHeight - panelOffset,
            decimalComplete = numerator/denominator,
            verse = getVerse($panel.data('id')),
            center = { 'x': windowWidth/2, 'y': windowHeight/2};

        $panel.children('.object').addClass('visible')
            .each(function()
            {
                var obj = verse.objects[$(this).data('idx')];
                //if the z index is negative it moves slower than the screen, positive; faster
                // find out the decimal representation for how far we are into the current panel
                $(this).css({
                    'left': (obj.pos_x + center.x) + 'px'
                })
                    .animate({
                        'top': ((obj.pos_y + center.y)*decimalComplete) + 'px'
                    }, 10);
            });
    }
    function getVerse(which)
    {
        which = parseInt( which );
        for( var i = site.verses.length; --i >= 0; )
            if( which === site.verses[i].id )
                return site.verses[i];
    }
    function hideAndResetPanel( $panel )
    {
        $panel.find('.object').removeClass('visible');
    }
    function getSiteJSON()
    {
        $.ajax({
            url:'/data/site.json', 
            success: function( data )
            {
                site = data;
                if( site.verses )
                    for( var i = site.verses.length; --i >= 0; )
                        $.ajax({
                            url: '/data/verse/' + site.verses[i] + '.json', 
                            success: function(data)
                            {
                                for( var j = site.verses.length; --j >= 0; )
                                    if( site.verses[j] === data.id )
                                        site.verses[j] = data;
                                $doc.trigger({ type: 'verseLoaded' });
                            }
                        });
            }
        });
    }
    function drawSite()
    {
        var markup = '',
            verseCount = site.verses.length,
            verses = [],
            $verses;
        for( var i = 0; i < verseCount; i++ )
        {
            var verse = site.verses[i],
                $verse = $(_verse( site.verses[i] ));
            $verse.css({
                'background-image': 'url("/data/image/' + verse.bg_image + '")',
                'background-color': '#' + verse.bg_color,
                'height': windowHeight + 'px'
            });
            verses.push( $verse );
        }
        $main.html('');
        $panels = $verses = $(verses);
        $verses.appendTo($main);
    }
    ($doc = $(document)).ready(function()
    {
        initGlobalVars();
        initDOM();
        initEvents();
    });
    
}())
