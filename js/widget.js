/**
 * Created by danielg on 11/16/17.
 */
var sections;
var buttons;
var clicks = {};
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
        $("#sections").append('<div class=\"closedSection\" id=\"closedSection' + index + '\" style=\"display: none;\"></div>');
        $("#sections").append('<div class=\"openSection\" id=\"openSection' + index + '\"></div>');
        $("#openSection" + index).append('<div class=\"sectionTitle\" id=\"sectionTitle' + index + '\">' + section.title + '</div>');
        $("#openSection" + index).append('<div class=\"sectionContainer\" id=\"sectionContainer' + index + '\"></div>');
        if (section.innerTitle) {
            $("#sectionContainer" + index).append(section.innerTitle);
        }
        $("#sectionContainer" + index).append('<div class=\"sectionContent\" id=\"sectionContent' + index + '\" style=\"margin-top: 10px; margin-bottom: 10px;\"></div>');
        if (section.type === 'buttons') {
            buttons = section.buttons;
            _displayButtons(index);
        }
    }
}

function _displayButtons(section) {
    if (buttons) {
        for(var i = 0; i < buttons.length; i++) {
            var button = buttons[i];
            clicks[i] = click.bind(this, i);
            $("#sectionContent" + section).append('<button class=\"offer\" onclick=\"clicks[' + i +']()\" title=\"' + button.title + '\" style=\"width: 290px; height: 200px; cursor: pointer; background-color: transparent; border: none; margin-top: 20px;\">' + button.html + '</button>');
        }
    }
}

function click(index) {
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
