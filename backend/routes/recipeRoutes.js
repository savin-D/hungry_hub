const express = require("express");
const router = express.Router();
const { addRecipe,
        getAllRecipes,
        getrecipeByID,
        deleteRecipe,
        updateRecipe,
        searchRecipes,
        toggleLikeRecipe,
        getTopRecipes
      } = require("../controllers/recipeController");
      
const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");

router.post("/",protect,upload.single("image"),addRecipe);
router.get("/",getAllRecipes);
router.get("/search",searchRecipes);
router.get("/top",getTopRecipes);
router.get("/view/:id",getrecipeByID);
router.put("/:id/likes",protect,toggleLikeRecipe);
router.put("/:id",protect,upload.single("image"),updateRecipe);
router.delete("/:id",protect,authorize("admin","user"),deleteRecipe);

module.exports = router;