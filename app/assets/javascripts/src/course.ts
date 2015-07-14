//(c) Jakub Krol 2015
/// <reference path="course_interface.ts" />
/// <reference path="../vendor/angularjs/angular.d.ts"/>
/// <reference path="angular_helpers"/>
/// <reference path="resources/course_rest_api.ts"/>
/// <reference path="../vendor/custom.d.ts"/>

declare var app:any;

module ApkiOrg.CourseMgr {
    export interface IAppCtrlScope extends ng.IScope {
        menuVisible:{'left':boolean; 'bottom':boolean};
        currPart:string;
        course:Course;
        api:CourseRestAPI;
        inited:boolean;
        courseId:string;
        quizChecking:boolean;

        initCourse(courseJSON:string)
        resizeElements()
        hidePanelBarClick(which:string)
        parseArticle()
        fullSizeElement(element:{}, $event:{})
        isPartVisible(part:string)
        goToPart(part:string)
        buildCourse(data:any)
        getLesson():Lesson
        checkQuiz(element:{}, $event:any)
    }

    export class myCtrl {
        public static $inject = [
            '$scope',
            '$timeout',
            '$compile',
            '$resource'
        ];
        constructor(private $scope: IAppCtrlScope, private $timeout: ng.ITimeoutService, private $compile:ng.ICompileService, private $resource:any) {

            $scope.checkQuiz = (element:any, $event:any) => {
                $scope.quizChecking = true;

                var _quiz:CommSendQuiz = new CommSendQuiz();
                _quiz.ID = $scope.getLesson().ID;

                _quiz.quizzes['55a512ef416d6927dc00000a'] = 8;
                _quiz.quizzes['55a512f0416d6927dc00000b'] = 0;

                console.log(_quiz);

                var _quiz_str:string = ApkiOrg.App.app.helperObjectToJSON(_quiz);

                console.log(_quiz_str);

                var $QuizCtrl:QuizRestAPI = new QuizRestAPI($resource);
                $QuizCtrl.res.check({}, _quiz_str, (ans:any) => {
                    console.log(ans);
                });

                $scope.quizChecking = false;
            }
            /**
             * Hold are menus visible
             * @type {{left: boolean, bottom: boolean}}
             */
            $scope.menuVisible={'left':true, 'bottom':true};

            /**
             * This will init Course. Required at the beginning. Called in ng-init.
             */
            $scope.initCourse = () => {
                var _f = () => {
                    $scope.inited = false;

                    $scope.currPart = 'article';

                    $(window).resize($scope.resizeElements);

                    $scope.api = new CourseRestAPI($resource);

                    $scope.course = $scope.api.res.show({'id':$scope.courseId}, '', $scope.buildCourse);
                }
                $timeout(_f, 1, false);
            }

            /**
             * This will create course object, init rest of app and set application as initialized.
             * Private.
             * @param any data Data from JSON
             */
            $scope.buildCourse = (data:any) => {
                $scope.parseArticle();

                $scope.inited = true;
                $scope.resizeElements();
            }

            /**
             * Gets current lesson.
             * @return Lesson Current lesson or null if all finished
             */
            $scope.getLesson = ():Lesson => {
                if ($scope.course.lessonCurrent>=$scope.course.lessons.length)
                    return null;
                else
                    return $scope.course.lessons[$scope.course.lessonCurrent];
            }

            /**
             * Hides or shows one of the menus.
             * @param string which
             */
            $scope.hidePanelBarClick = (which:string) => {
                $scope.menuVisible[which]=!$scope.menuVisible[which];
            }
            /**
             * This will be called in window resize. May be also used manually.
             * @param number delay Defaults to 0. When >0 it will postpone execution of this method for delay ms using $timeout.
             */
            $scope.resizeElements = (delay:number=0) => {
                var _resFnc = () => {
                    var freeHeight = $(window).height()-$('nav.navbar').height()-($('#courseLessons').is(':visible')?$('#courseLessons').height():3/*why required ??*/)-$('#courseContent').find('.secHidePanelBar').height();
                    $('#courseContent').height(freeHeight);
                    $('#courseContent').find('.col').height($('#courseContent').height());
                    $('#courseContent').find('.col.col-line-height-100-pro').css('line-height', $('#courseContent').height()+'px');
                    var freeWidth = $('#courseContent').width()-($('#courseContent').find('.col.first').is(':visible')?$('#courseContent').find('.col.first').width():0)-$('#courseContent').find('.firstHidePanelBar').width();
                    $('#courseContent').find('.col.sec').width(freeWidth);

                    if ($('.full-screen-element').length==1){
                        $('.full-screen-element').height(freeHeight-$('.full-screen-element').prev().prev().height());
                        $('.full-screen-element').prev().prev()[0].scrollIntoView( true );
                    }
                }
                if (delay>0)
                    $timeout(_resFnc, delay, false);
                else
                    _resFnc();
            }

            /**
             * This is for parsing article :-)
             * Private.
             */
            $scope.parseArticle = () => {
                $timeout(() => {

                    var get_gen_id = (element:any):string => {
                        if ($.inArray($(element).attr('id'), [undefined, null, ''])>-1){
                            var rand_id:string;
                            do {
                                var rand_id = 'anchor_'+Math.round(Math.random()*1000)+Math.round(Math.random()*1000);
                            } while ($('*[id="'+rand_id+'"]').length>0);
                            $(element).attr('id', rand_id);
                        }
                        return $(element).attr('id');
                    };
                    var art_el : JQuery = $('#courseCnt').find('.course-article');
                    if (art_el.length==0) return;
                    var sub_cats : {'title':string; 'anchor':string; 'ico':string}[] = [];

                    art_el.find(':header, iframe').each(function(){
                        if ($(this).is(':header')){
                            sub_cats.push({
                                'title': $.trim($(this).text()),
                                'anchor':'#'+get_gen_id(this),
                                'ico':'glyphicon-align-justify'
                            });
                        }
                        if ($(this).is('iframe')){
                            if ($.inArray($(this).attr('alt'), [undefined, null, ''])>-1){
                                $(this).attr('alt', 'Film');
                            }
                            var iframe_id:string = get_gen_id(this);
                            $(this).wrap('<div></div>');
                            $(this).before('<a href="javascript:;" ng-click="fullSizeElement(this, $event)">Przejdź do trybu pełnoekranowego</a><br>');
                            $compile($(this).parent('div'))($scope);
                            sub_cats.push({
                                'title': $.trim($(this).attr('alt')),
                                'anchor':'#'+iframe_id,
                                'ico':'glyphicon-facetime-video'
                            });
                        }
                    });

                    $('#courseLessonMenu').find('ul.article-parsed').html(''); //Empty article-parsed submenu
                    $.each(sub_cats, function(){
                        $('#courseLessonMenu').find('ul.article-parsed').append('<li><i class="glyphicon '+this.ico+'"></i> <a href="'+this.anchor+'" ng-click="goToPart(\'article\')">'+this.title+'</a></li>');
                    });
                    $compile($('#courseLessonMenu').find('ul.article-parsed'))($scope);
                }, 1, false);
            }

            /**
             * Select element in article as full-screen element.
             * @param string/DOMElement/jQuery element. Not used right now.
             * @param any $event Original event with $event.currentTarget.
             */
            $scope.fullSizeElement = (element:any, $event:any) => {
                $('.full-screen-element').removeClass('.full-screen-element');

                if ($($event.currentTarget).data('full-screen') === true) {
                    //close full-screen:
                    $('#courseCnt').removeClass('full-screen-art-element');

                    $($event.currentTarget).text('Przejdź do trybu pelnoekranowego');

                    $($event.currentTarget).next().next().removeClass('full-screen-element').height($($event.currentTarget).next().next().data('oryg-height'));

                    $($event.currentTarget).data('full-screen', false);
                } else {
                    //open full-screen:
                    $('#courseCnt').addClass('full-screen-art-element');

                    $($event.currentTarget).text('Wyjdź z trybu pelnoekranowego');

                    $($event.currentTarget).next().next().addClass('full-screen-element').data('oryg-height', $($event.currentTarget).next().next().height());

                    $($event.currentTarget).data('full-screen', true);
                }

                $($event.currentTarget)[0].scrollIntoView( true );
            }
            $scope.isPartVisible = (part:string):boolean =>{
                return $scope.currPart == part;
            }
            $scope.goToPart = (part:string) =>{
                var possibleParts:boolean[] = [];
                possibleParts['article'] = true; //always enabled
                possibleParts['end'] = true; //always enabled
                possibleParts['quiz'] = (!!$scope.getLesson().quizzes.length);
                possibleParts['exercise'] = (!!$scope.getLesson().quizzes.length);
                var path:string[] = ['article', 'quiz', 'exercise', 'end'];
                if (!possibleParts[part])
                    part = path[path.indexOf(part)+1];

                $scope.currPart = part;
            }

        }
    }

    app = angular.module('courseApp', ['ngResource']);
    app.controller('myCtrl', myCtrl);
    app.filter('to_trusted', ['$sce', ($sce) => {
        return (text) => {
            return $sce.trustAsHtml(text);
        };
    }]);

    class SelectPickerDirective
    {
        public link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;
//        public template = '<div>{{name}}</div>';
        public scope = {};

        constructor($timeout)
        {
            // It's important to add `link` to the prototype or you will end up with state issues.
            // See http://blog.aaronholmes.net/writing-angularjs-directives-as-typescript-classes/#comment-2111298002 for more information.
            SelectPickerDirective.prototype.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) =>
            {
                $timeout((element) => {
                    $(element).selectpicker();
                }, 0, true, element);
            };
        }

        public static Factory()
        {
            var directive = ($timeout) =>
            {
                return new SelectPickerDirective($timeout);
            };

            directive['$inject'] = ['$timeout'];

            return directive;
        }
    }

    app.directive('selectpicker', SelectPickerDirective.Factory());

    export class Achivement implements IAchievement{
        ID                  :number;            //Unique ID of achievement

        title               :string;            //Title of achievement
        icon_src            :string;            //Src to use with image to represent achievement
        points              :number;            //Number of points to add (DONT USE IT AT SERVER SIDE, use ID of achievement instead)
    }

    export class Quiz implements IQuiz{
        ID                  :number;            //Unique ID of quiz

        question            :string;            //Content of question (HTML)
        answers             :string[];          //Array of possible anserws.

        achievement         :Achivement;      //Achievement for finished quiz (null if none)

        constructor() {
            this.answers     =   [];
            this.achievement = null;
        }
    }

    export class CodeLockCoord implements ICodeLockCoord{
        rowStart            :number;            //Beginning of code lock - starting row
        colStart            :number;            //Beginning of code lock - starting column
        rowEnd              :number;            //End of code lock - ending row
        colEnd              :number;            //End of code lock - ending column
    }

    export class Exercise implements IExercise{
        ID                  :number;            //Unique ID of exercise

        content_of_exercise :string;            //Content of exercise (command what to do) (HTML)
        code                :string;            //Initial visible code
        code_locks          :CodeLockCoord[];  //Code locks
        allow_user_input    :boolean;           //True if user input should be visible
        lang                :string;            //Programming language ACE code

        achievement         :Achivement;      //Achievement for finished exercise (null if none)

        constructor() {
            this.code_locks     =   [];
            this.achievement = null;
        }
    }

    export class Lesson implements ILesson{
        ID                  :number;            //Unique ID of lesson

        title               :string;            //Title of lesson

        article             :string;            //Conent of article in lesson (HTML)
        quizzes             :Quiz[];           //Quizes of lesson (empty if none)
        exercises           :Exercise[];       //Exercises of lesson (empty if none)

        achievement         :Achivement;      //Achievement for finished lesson (null if none)

        constructor() {
            this.quizzes     =   [];
            this.exercises   =   [];
            this.achievement = null;
        }
    }

//    export class CourseAngulared implements ICourseAngulared{
//
//    }

    export class Course implements ICourse{
        //Constant Metadata
        ID                  :number;            //Unique ID of course
        title               :string;            //Title of the Course
        description         :string;            //Description of the Course
        icon_src            :string;            //Src to use with images to represent current course

        //User-variable-metadata
        lessonsPassed       :number[];          //List of IDs of passed lessons
        lessonCurrent       :number;            //ID of current lesson, 0 or first lesson ID == from the beginning
        finished            :boolean;           //True if course is finished

        //Lessions:
        lessons            :Lesson[];         //Lessions in course

        constructor() {
            this.lessonsPassed  =   [];
            this.lessons        =   [];
        }
    }

    export class CommSendExercise implements ICommSendExercise{
        ID                  :number;            //Unique ID
        code                :string;            //Whole code
        user_input          :string;            //Whole user input (empty if not allowed)
    }

    export class CommRecvExercise implements ICommRecvExercise{
        ID                  :number;            //Unique ID
        output              :string;            //Output of code / errors / console, whatever...
        is_correct          :boolean;           //True if output is correct, as expected
    }

    export class CommSendQuiz implements ICommSendQuiz{
        ID                  :number;            //Unique Lesson ID
        quizzes             :{};                //Quiz ID : Answer idx

        constructor() {
            this.quizzes  =   {};
        }
    }

    export class CommRecvQuiz implements ICommRecvQuiz{
        ID                  :number;            //Unique ID
        is_correct          :boolean;           //True if answer is correct
    }
}