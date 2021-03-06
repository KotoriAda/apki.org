module Course
  class AchievementsController < CourseAdminController
    before_action :set_course_achievement, only: [:show, :update, :destroy]

    # GET /course/achievements.json
    def index
      if params[:course_id].present?
        course = Course::CourseDatum.find(params[:course_id])
        lessons = course.course_lessons
        lessons_ids = lessons.map { |lesson| lesson.id.to_s }
        exercises_ids = []
        lessons.each do |lesson|
          exercises_ids.concat lesson.course_exercises.map { |exercise| exercise.id.to_s }
        end
        @course_achievements = Course::Achievement.or({ :lesson_id.in => lessons_ids }, :exercise_id.in => exercises_ids)
      end

      if params[:lesson_id].present?
        lesson = Course::Lesson.find(params[:lesson_id])
        @course_achievements = Course::Achievement.where(lesson_id: lesson.id.to_s)
      end

      if params[:exercise_id].present?
        exercise = Course::Exercise.find(params[:exercise_id])
        @course_achievements = Course::Achievement.where(exercise_id: exercise.id.to_s)
      end
    end

    # GET /course/achievements/1.json
    def show
    end

    # POST /course/achievements.json
    def create
      fail Exceptions::NotFound unless check_achievement_type

      respond_to do |format|
        if @course_achievement.save
          format.json { render :show, status: :created, location: @course_achievement }
        else
          format.json { render json: @course_achievement.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /course/achievements/1.json
    def update
      @course_achievement[:data] = @course_achievement.data.merge(JSON.parse(request.body.read))
      respond_to do |format|
        if @course_achievement.save
          format.json { render :show, status: :ok, location: @course_achievement }
        else
          format.json { render json: @course_achievement.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /course/achievements/1.json
    def destroy
      @course_achievement.destroy
      respond_to do |format|
        format.json { head :no_content }
      end
    end

    private

    def set_course_achievement
      @course_achievement = Course::Achievement.find(params[:id])
    end

    def check_achievement_type
      id_present = false
      @course_achievement = Course::Achievement.new

      if params.key?(:lesson_id) && Course::Lesson.where(id: params[:lesson_id]).exists?
        id_present = true
        @course_achievement.lesson_id = params[:lesson_id]
      end
      if !id_present && params.key?(:exercise_id) && Course::Exercise.where(id: params[:exercise_id]).exists?
        id_present = true
        @course_achievement.exercise_id = params[:exercise_id]
      end
      id_present
    end
  end
end
