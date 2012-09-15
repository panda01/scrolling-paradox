/*
 *  The parralex
 */
(function()
{
    var windowHeight,
        windowScroll = 0;

    var $doc,
        $window,
        $main,
        $panels;

    var paradoxDefaultRatios = [ 1.0, 1.3, 0.5 ];
    
    function initGlobalVars()
    {
        $window = $(window);

        windowHeight = $(window).height();

        $main = $('div#main');
        $panels = $main.children('.panel'); 
    }
    function initDOM()
    {
        $main.height( windowHeight );
        $panels.height( windowHeight );
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
            .on('resize', function()        { windowHeight = $window.height(); });
    }
    function isPanelVisible($el)
    {
        var offset = $el.offset().top;
        return ( offset+windowHeight > windowScroll && offset < windowScroll + windowHeight );
    }
    function animateForParadox($panel)
    {
        //do all the animates and maths to move the elements inside of this div  in a illusion
        for( var i = paradoxDefaultRatios.length; --i >= 0; )
        {
            var paradoxRatio = paradoxDefaultRatios[i],
                panelOffset = $panel.offset().top;
            $panel.find('.layer-' + i ).addClass('visible')
                .each(function()
                {
                    var top = (windowScroll * paradoxRatio);
                    console.log( windowScroll );
                    $(this).offset({ top: top });
                });
        }
    }
    function hideAndResetPanel( $panel )
    {
        $panel.find('.layer').removeClass('visible');
    }
    
    ($doc = $(document)).ready(function()
    {
        initGlobalVars();
        initDOM();
        initEvents();
    });
    
}())
