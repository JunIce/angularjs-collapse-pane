'use strict';

angular.module('volcan0.collapse-pane',[])
.directive('vDivider', function(){
    return {
        restrict: 'EA',
        replace: true,
        require: 'vContainer',
        template: `<div class='multipane-resizer'></div>`
    }
})
.directive('vContainer', function() {
    return {
        restrict: 'EA',
        transclude: true,
        replace: true,
        scope: {
            layout: '=',
            resizeStart: '@',
            resizeing: '@',
            resizeStop: '@',
        },
        template: `<div ng-transclude></div>`,
        link: function($scope, element, attrs){
            var LAYOUT_HORIZONTAL = 'horizontal';
            var LAYOUT_VERTICAL = 'vertical';

            element.addClass('multipane');

            $scope.isResizing = false;

            var layout = $scope.layout || 'vertical';

            element.addClass('layout-'+layout.slice(0,1));

            element.on('mousedown', onMouseDown)

            function onMouseDown(e) {
                var target = e.target;
                var initialPageX = e.pageX;
                var initialPageY = e.pageY;
                if(angular.element(target).hasClass('multipane-resizer')){
                    var container = e.target.previousElementSibling;
                    var containerWidth = container.offsetWidth;
                    var containerHeight = container.offsetHeight;

                    let usePercentage = !!(container.style.width + '').match('%')

                    function resize(initialSize, offset) {
                        if (layout === LAYOUT_VERTICAL) {
                            var value = usePercentage ? (initialSize + offset) / containerWidth * 100 + '%': initialSize + offset + 'px';
                            angular.element(container).css('width' , value);
                        }

                        if (layout === LAYOUT_HORIZONTAL) {
                            var value = usePercentage ? (initialSize + offset) / containerHeight * 100 + '%': initialSize + offset + 'px';
                            angular.element(container).css('height' , value);
                        }
                    }

                    $scope.isResizing = true;

                    $scope.resizeStart && $scope.resizeStart(element, container);

                    function onMouseMove(event) {
                        var initialSize = layout === LAYOUT_VERTICAL ? containerWidth : containerHeight;
                        var offset = layout === LAYOUT_VERTICAL ? event.pageX - initialPageX : event.pageY - initialPageY;
                        resize(initialSize, offset);
                        $scope.resizeing && $scope.resizeing(element, container);
                    }

                    function onMouseUp() {
                        var initialSize = layout === LAYOUT_VERTICAL ? container.clientWidth : container.clientHeight;
                        resize(initialSize, 0);
                        $scope.isResizing = false;
                        $scope.resizeStop && $scope.resizeStop(element, container);
                        window.removeEventListener('mousemove', onMouseMove);
                        window.removeEventListener('mousemove', onMouseUp);
                    }

                    window.addEventListener('mousemove', onMouseMove);
                    window.addEventListener('mouseup', onMouseUp);
                }
            }
        }
    };
})
