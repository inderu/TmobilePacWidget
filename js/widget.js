/**
 * Created by danielg on 11/16/17.
 */
var sections;
var sectionClicks = {};
var buttons;
var buttonClicks = {};
var SDK = lpTag.agentSDK || {};
$(function() {
    SDK.init({});
    _loadSections();
});

function _loadSections() {
    $.getJSON("js/sections.json", function(json) {
        sections = json;
        for (var i = 0; i < sections.length; i++) {
            _displaySection(i);
        }
    });
}

function _displaySection(index) {
    var section = sections[index];
    if (section) {
        section.isOpen = index === 0;
        sectionClicks[index] = _sectionClick.bind(this, index);
        $("#sections").append('<div class=\"section\" id=\"section' + index + '\"></div>');
        $("#section" + index).append('<div class=\"closedSection\" id=\"closedSection' + index + '\"></div>');
        $("#closedSection" + index).append('<div class=\"titleContainer\" id=\"closedTitle' + index + '\" onclick=\"sectionClicks[' + index +']()\"></div>');
        $("#closedTitle" + index).append('<span class=\"sectionTitle\">' + section.title + '</span>');
        $("#closedTitle" + index).append('<span class=\"sectionArrow\">\u25B2</span>');
        $("#section" + index).append('<div class=\"openSection\" id=\"openSection' + index + '\" onclick=\"sectionClicks[' + index +']()\"></div>');
        $("#openSection" + index).append('<div class=\"titleContainer\" id=\"openTitle' + index + '\"></div>');
        $("#openTitle" + index).append('<span class=\"sectionTitle\">' + section.title + '</span>');
        $("#openTitle" + index).append('<span class=\"sectionArrow\">\u25BC</span>');
        $("#openSection" + index).append('<div class=\"sectionContainer\" id=\"sectionContainer' + index + '\"></div>');
        if (section.innerTitle) {
            $("#sectionContainer" + index).append(section.innerTitle);
        }
        $("#sectionContainer" + index).append('<div class=\"sectionContent\" id=\"sectionContent' + index + '\" style=\"margin-top: 10px; margin-bottom: 10px;\"></div>');
        if (section.type === 'buttons') {
            buttons = section.buttons;
            _displayButtons(index);
        }
        _setSectionVisibility(index);
    }
}

function _sectionClick(index) {
    if (sections && sections.length > index) {
        var section = sections[index];
        if (section) {
            section.isOpen = !section.isOpen;
            _setSectionVisibility(index);
        }
    }
}

function _setSectionVisibility(index) {
    $('#section' + index).removeClass('open');
    if (sections[index].isOpen) {
        $('#section' + index).addClass('open');
    }
}

function _displayButtons(section) {
    if (buttons) {
        for(var i = 0; i < buttons.length; i++) {
            var button = buttons[i];
            buttonClicks[i] = _buttonClick.bind(this, i);
            $("#sectionContent" + section).append('<button class=\"offer\" onclick=\"buttonClicks[' + i +']()\" title=\"' + button.title + '\" style=\"width: 290px; height: 200px; cursor: pointer; background-color: transparent; border: none; margin-top: 20px;\">' + button.html + '</button>');
        }
    }
}

function _buttonClick(index) {
    if (buttons && buttons.length > index) {
        var data = buttons[index];
        if (data && data.structuredContent) {
            _sendStructuredContent(data.structuredContent, data.metaData);
        }
    }
}

function _sendStructuredContent(sc, md) {
    var cmdName = lpTag.agentSDK.cmdNames.writeSC;
    var data = {
        json: sc,
        metadata: md
    };

    SDK.command(cmdName, data, function (err) {
        if (err) {
            _log('There was a problem sending the structured content! error message: ' + err);
        } else {
            _log('');
        }
    });
}

function _log(text){
    var area = $("#log");
    area.text(text);
}
