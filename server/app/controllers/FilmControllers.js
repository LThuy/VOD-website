const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('../../models/Account')
const Favfilm = require('../../models/FavorFilm');
const Film = require('../../models/Film');
const {
  removeVietnameseTones
} = require('../../utils/vietnameseUtils');


class FilmControllers {


  // [GET] :get films
  async getFilms(req, res) {
    try {
      // Fetch all films from the database
      const films = await Film.find();

      // Respond with the retrieved films
      res.status(200).json({
        success: true,
        data: films,
      });
    } catch (error) {
      // Handle errors
      res.status(500).json({
        success: false,
        message: 'Error retrieving films',
        error: error.message,
      });
    }
  }

  async getMoviesCount(req, res) {
    try {
      const count = await Film.countDocuments();
      res.json({
        count
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching movie count',
        error
      });
    }
  }

  // [GET] : Get film by ID
  async getFilmById(req, res) {
    const {
      filmId
    } = req.params; // Get filmId from URL parameter

    try {
      const film = await Film.findById(filmId); // Find film by ID

      if (!film) {
        return res.status(404).json({
          success: false,
          message: 'Film not found',
        });
      }

      res.status(200).json({
        success: true,
        data: film, // Send the film data as response
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving film',
        error: error.message,
      });
    }
  }

  // [DELETE] :delete a film
  async deleteFilm(req, res) {
    const {
      filmId
    } = req.params;

    try {
      // Find and delete the film by its _id
      const deletedFilm = await Film.findByIdAndDelete(filmId);

      if (!deletedFilm) {
        return res.status(404).json({
          success: false,
          message: 'Film not found',
        });
      }

      // Respond with success message after deletion
      res.status(200).json({
        success: true,
        message: 'Film deleted successfully',
      });
    } catch (error) {
      // Handle errors
      res.status(500).json({
        success: false,
        message: 'Error deleting film',
        error: error.message,
      });
    }
  }
  // [PUT] : Edit film
  async editFilm(req, res) {
    const {
      filmId
    } = req.params;
    let updatedData = {
      ...req.body
    };

    try {
      // Array of fields that need to be parsed from JSON
      const arrayFields = ['category', 'country', 'actor', 'director', 'comments', 'episodes'];

      // Parse all array fields or use existing data
      for (const field of arrayFields) {
        if (updatedData[field]) {
          try {
            if (Array.isArray(updatedData[field])) {
              continue;
            }
            updatedData[field] = JSON.parse(updatedData[field]);
          } catch (e) {
            console.error(`Error parsing ${field}:`, e);
            if (field === 'actor' || field === 'director') {
              updatedData[field] = updatedData[field].split(',').map(item => item.trim());
            } else {
              updatedData[field] = [];
            }
          }
        }
      }

      // Convert boolean strings to actual booleans
      const booleanFields = ['is_copyright', 'sub_docquyen', 'chieurap'];
      booleanFields.forEach(field => {
        if (updatedData[field] !== undefined) {
          updatedData[field] = updatedData[field] === 'true';
        }
      });

      // Convert year to number if present
      if (updatedData.year) {
        updatedData.year = parseInt(updatedData.year, 10);
      }

      // Find the existing film first
      const existingFilm = await Film.findById(filmId);
      if (!existingFilm) {
        return res.status(404).json({
          success: false,
          message: 'Film not found',
        });
      }

      // Keep existing arrays if not provided in update
      arrayFields.forEach(field => {
        if (!updatedData[field] || (Array.isArray(updatedData[field]) && updatedData[field].length === 0)) {
          updatedData[field] = existingFilm[field];
        }
      });

      // Add or update timestamp fields
      updatedData.modified = {
        time: new Date()
      };

      // Keep the original creation time
      if (existingFilm.created && existingFilm.created.time) {
        updatedData.created = {
          time: existingFilm.created.time
        };
      } else {
        // If for some reason created time doesn't exist, set it
        updatedData.created = {
          time: new Date()
        };
      }

      console.log('Final processed update data:', updatedData);

      const film = await Film.findByIdAndUpdate(
        filmId,
        updatedData, {
          new: true,
          runValidators: true
        }
      );

      res.status(200).json({
        success: true,
        message: 'Film updated successfully',
        data: film,
      });
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating film',
        error: error.message,
      });
    }
  }

  // [POST] : add favorite film
  async addFavorite(req, res) {
    const {
      userId,
      filmData
    } = req.body;

    try {
      // Validate filmData and userId
      if (!userId || !filmData || !filmData._id) {
        return res.status(400).json({
          status: false,
          message: "Invalid data: userId and filmData with _id are required.",
        });
      }

      // Find the user by ID
      const user = await User.findById(userId).populate('favoriteFilms');

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found"
        });
      }

      // Ensure favoriteFilms is an array and check if film already exists
      if (Array.isArray(user.favoriteFilms)) {
        const isFilmExists = user.favoriteFilms.some(
          (film) => film && film._id && film._id.toString() === filmData._id.toString()
        );

        if (isFilmExists) {
          return res.status(400).json({
            status: false,
            message: "This film is already in your favorite list.",
          });
        }
      } else {
        // If favoriteFilms is not an array, initialize it as an empty array
        user.favoriteFilms = [];
      }

      // Add the film data to the favoriteFilms array
      user.favoriteFilms.push(filmData);

      // Save the updated user document
      await user.save();

      // Send success response
      res.status(200).json({
        status: true,
        message: "Favorite film added successfully!",
        favoriteFilms: user.favoriteFilms,
      });
    } catch (error) {
      console.error("Error adding favorite film:", error);
      res.status(500).json({
        status: false,
        message: "An error occurred while adding the favorite film.",
      });
    }
  }

  // POST /film/is-favorite
  async checkFavorite(req, res) {
    const {
      userId,
      filmId
    } = req.body;

    try {
      const user = await User.findById(userId).populate('favoriteFilms');
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found"
        });
      }

      const isFavorite = user.favoriteFilms.some(film => film._id.toString() === filmId);
      res.status(200).json({
        status: true,
        isFavorite
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error checking if the film is liked."
      });
    }
  }
  async getFavorties(req, res) {
    const userId = req.params.userId;

    try {
      // Validate userId (ensure it's a valid ObjectId)
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          message: 'Invalid user ID'
        });
      }

      // Retrieve the user with their favorite films
      const user = await User.findById(userId).select('favoriteFilms');

      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      // Return the user's favorite films
      res.status(200).json(user.favoriteFilms);
    } catch (error) {
      console.error('Error retrieving favorite films:', error);
      res.status(500).json({
        message: 'Server error'
      });
    }
  }

  async deleteFavorFilm(req, res) {
    const {
      userId,
      filmId
    } = req.body;

    try {
      // Validate inputs
      if (!userId || !filmId) {
        return res.status(400).json({
          status: false,
          message: "Invalid data: userId and filmId are required.",
        });
      }

      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found.",
        });
      }

      // Check if the film exists in the user's favorite list
      const filmExists = user.favoriteFilms.some(
        (film) => film._id.toString() === filmId
      );
      if (!filmExists) {
        return res.status(404).json({
          status: false,
          message: "Film not found in the user's favorite list.",
        });
      }

      // Remove the film from the user's favorite list
      user.favoriteFilms = user.favoriteFilms.filter(
        (film) => film._id.toString() !== filmId
      );

      // Save the updated user document
      await user.save();

      res.status(200).json({
        status: true,
        message: "Film removed from favorites successfully.",
        favoriteFilms: user.favoriteFilms,
      });
    } catch (error) {
      console.error("Error removing favorite film:", error);
      res.status(500).json({
        status: false,
        message: "An error occurred while removing the favorite film.",
      });
    }
  }
  // history film section
  async addHistory(req, res) {
    const {
      userId,
      filmData
    } = req.body;
    console.log(filmData);
    try {
      // Validate userId and filmData
      if (!userId || !filmData || !filmData._id) {
        return res.status(400).json({
          status: false,
          message: "Invalid data: userId and filmData with _id are required.",
        });
      }

      // Find the user by ID
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }

      // Remove existing film if it exists to prevent duplicates
      user.historyFilms = user.historyFilms.filter(
        film => film._id.toString() !== filmData._id.toString()
      );

      // Add the new film to the end (most recent)
      user.historyFilms.push(filmData);

      // If history exceeds a certain limit (e.g., 50 films), remove the oldest entries
      const MAX_HISTORY_LENGTH = 50;
      if (user.historyFilms.length > MAX_HISTORY_LENGTH) {
        user.historyFilms = user.historyFilms.slice(-MAX_HISTORY_LENGTH);
      }

      // Save the updated user document
      await user.save();

      return res.status(200).json({
        status: true,
        message: "Film added to history successfully!",
        historyFilms: user.historyFilms,
      });

    } catch (error) {
      console.error("Error adding history film:", error);
      res.status(500).json({
        status: false,
        message: "An error occurred while adding the film to history.",
      });
    }
  }

  async getHistoryFilm(req, res) {
    const userId = req.params.userId;

    try {
      // Validate userId (ensure it's a valid ObjectId)
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          message: 'Invalid user ID'
        });
      }

      // Retrieve the user with their favorite films
      const user = await User.findById(userId).select('historyFilms');

      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      // Return the user's favorite films
      res.status(200).json(user.historyFilms);
    } catch (error) {
      console.error('Error retrieving favorite films:', error);
      res.status(500).json({
        message: 'Server error'
      });
    }
  }

  //Get New Film
  async getNewestFilm(req, res) {
    try {
      const {
        page = 1, limit = 10
      } = req.query; // Get pagination parameters

      // Retrieve films from the database with pagination
      const films = await Film.find({
          status: "active"
        })
        .skip((page - 1) * limit) // Skipping the documents for pagination
        .limit(limit) // Limiting the number of films returned
        .exec();

      // Get the total number of films for pagination
      const totalFilms = await Film.countDocuments();

      // Format the response
      const response = {
        status: true,
        items: films.map(film => ({
          _id: film._id,
          name: film.name,
          slug: film.slug,
          origin_name: film.origin_name,
          poster_url: film.poster_url,
          thumb_url: film.thumb_url,
          year: film.year,
        })),
        pagination: {
          totalItems: totalFilms,
          totalItemsPerPage: limit,
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalFilms / limit),
        },
      };

      // Return the formatted response
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: 'Error retrieving films'
      });
    }
  }

  //Get Film Detail
  async getFilmDetails(req, res) {
    try {
      // Extract slug from the request parameters
      const {
        slug
      } = req.params;
      // console.log(slug)

      // Find the film by slug in the database
      const film = await Film.findOne({
        "slug": slug
      });

      // If film not found, return a 404 response
      if (!film) {
        return res.status(404).json({
          status: false,
          message: 'Film not found'
        });
      }

      // Return the entire film document
      res.json(film);
    } catch (error) {
      console.error('Error fetching film by slug:', error);
      res.status(500).json({
        status: false,
        message: 'Server error'
      });
    }
  }

  //Set Film Active
  async setFilmActive(req, res) {
    try {
      // Extract slugPayload from the request body
      const {
        slug
      } = req.body;

      // Ensure the slugPayload contains the slug
      if (!slug) {
        return res.status(400).json({
          status: false,
          message: 'Slug is required',
        });
      }

      // console.log(`Received slug: ${slug}`);

      // Find the film by slug and update its status to "active"
      const updatedFilm = await Film.findOneAndUpdate({
          slug: slug
        }, // Match condition
        {
          $set: {
            status: 'active'
          }
        }, // Update the status field
        {
          new: true
        } // Return the updated document
      );

      // If film not found, return a 404 response
      if (!updatedFilm) {
        return res.status(404).json({
          status: false,
          message: 'Film not found',
        });
      }

      // Return the updated film document
      res.json({
        status: true,
        message: 'Film status updated to active',
        data: updatedFilm,
      });
    } catch (error) {
      console.error('Error setting film status to active:', error);
      res.status(500).json({
        status: false,
        message: 'Server error',
      });
    }
  }

  async setStatusVideo(req, res) {
    try {
      // Extract slugPayload from the request body
      const {
        slug, status
      } = req.body;

      // Ensure the slugPayload contains the slug
      if (!slug) {
        return res.status(400).json({
          status: false,
          message: 'Slug is required',
        });
      }

      // console.log(`Received slug: ${slug}`);

      // Find the film by slug and update its status to "active"
      const updatedFilm = await Film.findOneAndUpdate({
          slug: slug
        }, // Match condition
        {
          $set: {
            status: status
          }
        }, // Update the status field
        {
          new: true
        } // Return the updated document
      );

      // If film not found, return a 404 response
      if (!updatedFilm) {
        return res.status(404).json({
          status: false,
          message: 'Film not found',
        });
      }

      // Return the updated film document
      res.json({
        status: true,
        message: 'Film status updated to active',
        data: updatedFilm,
      });
    } catch (error) {
      console.error('Error setting film status to active:', error);
      res.status(500).json({
        status: false,
        message: 'Server error',
      });
    }
  }

  async getSeachFilm(req, res) {
    try {
      const {
        keyword
      } = req.query;

      if (!keyword) {
        return res.status(400).json({
          message: 'Search keyword is required'
        });
      }

      // Lấy tất cả các phim
      const allFilms = await Film.find()
        .select('_id name slug poster_url description genre status');

      // Lọc phim dựa trên keyword
      const matchedFilms = allFilms.filter(film => {
        // Chuyển đổi tên phim và keyword thành chữ thường và bỏ dấu
        const normalizedFilmName = removeVietnameseTones(film.name.toLowerCase());
        const normalizedKeyword = removeVietnameseTones(keyword.toLowerCase());

        // Kiểm tra xem keyword có trong tên phim không
        return normalizedFilmName.includes(normalizedKeyword);
      });

      // Lọc chỉ lấy những phim có status active
      const activeFilms = matchedFilms.filter(film => film.status === 'active');

      res.json(activeFilms);

    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({
        message: 'Internal server error'
      });
    }
  }
  async getYearFilm(req, res) {
    try {
      const year = req.params.year;
      const page = parseInt(req.query.page) || 1;
      const limit = 60; // Same as your current limit
      const skip = (page - 1) * limit;

      // Create base query
      let query = {
        status: 'active'
      };

      // Add year to query if provided
      if (year && year !== 'all') {
        query.year = parseInt(year);
      }

      // Get total count for pagination
      const total = await Film.countDocuments(query);

      // Get films
      const films = await Film.find(query)
        .select('_id name slug poster_url year')
        .skip(skip)
        .limit(limit)
        .sort({
          createdAt: -1
        });

      res.json({
        films,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          total
        }
      });

    } catch (error) {
      console.error('Error fetching films by year:', error);
      res.status(500).json({
        message: 'Internal server error'
      });
    }
  }
  async getGenreFilm(req, res) {
    try {
      const { slug } = req.params;
  
      // Find all films that have this genre (category slug)
      const films = await Film.find({ 'category.slug': slug, 'status': 'active'})
        .sort({ createdAt: -1 }) // Sort newest first
        .select('name slug poster_url category type'); // Select only needed fields
  
      res.json({
        items: films,
        totalItems: films.length, // Total number of films
      });
    } catch (error) {
      console.error('Error fetching films:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
}

module.exports = new FilmControllers();