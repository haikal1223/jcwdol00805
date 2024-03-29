const { multerUpload } = require("../lib/multer");

const uploadImage = (req, res, next) => {
	const multerResult = multerUpload.fields([{ name: "image", maxCount: 1 }]);
	multerResult(req, res, function (error) {
		try {
			if (error) throw error;
			req.files.images.forEach((value) => {
				if (value.size > 10000000)
					throw {
						message: `${value.originalname} size too large`,
						fileToDelete: req.files,
					};
			});
			next();
		} catch (error) {
			if (error.fileToDelete) {
				deleteFiles(error.fileToDelete);
			}
			return res.status(413).send({
				isError: true,
				message: error.message,
				data: null,
			});
		}
	});
};
