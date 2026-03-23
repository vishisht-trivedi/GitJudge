const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  username: { type: String, required: true, lowercase: true, trim: true, index: true },
  githubData: {
    name: String,
    bio: String,
    avatar_url: String,
    public_repos: Number,
    followers: Number,
    following: Number,
    created_at: String,
    location: String,
    company: String,
    total_stars: Number,
    top_languages: [String],
    most_starred_repo: String
  },
  verdict: {
    cookRank: String,
    roastText: String,
    chemistryScore: Number,
    stats: {
      commitPurity: Number,
      languageMastery: Number,
      repoQuality: Number,
      communityRep: Number,
      heisenbergFactor: Number
    },
    tags: [String],
    quote: String,
    verdict: String
  },
  recruiterData: { type: mongoose.Schema.Types.Mixed, default: null },
  analysisCount: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ProfileSchema.index({ 'verdict.chemistryScore': -1 });
ProfileSchema.index({ analysisCount: -1 });

module.exports = mongoose.model('Profile', ProfileSchema);
