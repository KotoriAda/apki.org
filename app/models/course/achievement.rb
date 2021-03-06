module Course
  class Achievement
    include Mongoid::Document
    include Mongoid::Timestamps

    field :data, type: Hash, default: {}
    field :lesson_id, type: String
    field :exercise_id, type: String
  end
end
