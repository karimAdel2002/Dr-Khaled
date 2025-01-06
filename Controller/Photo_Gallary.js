import Photo_Gallaries from "../DB Models/Photo_Gallary.js"
import Photo_Gallary_images from "../DB Models/Photo_Gallary_images.js"
import Admins from "../DB Models/Admin.js"
import jwt from "jsonwebtoken"


export const index = async (req, res) => {
    try {
        // await Photo_Gallary_images.create({
        //             Photo_Gallary : "677aadd296cc278bd18c55a6",
        //             name  : "Buccal Fat Pad Excision",
        //             title1 : "Buccal Fat Pad Excision",
        //             description1 : "A buccal fat extraction (usually pronounced like a buckle) is the procedure to remove the fat pads that augment the lower part of the cheeks. Often times, if you purse your lips to whistle, you will notice a more chiseled, hollow look. It is also a procedure that is often sought to remedy a condition often referred to as “chipmunk cheeks.” You may have heard it called “cheek reduction surgery,” as well. It is an appearance that individuals in their late 20s to early 30s begin to see naturally as they age. It’s also interesting to note that treatment of this condition is popular with many fashion runway models. The procedure requires special expertise and artistic capability. Fortunately, Dr. Romano has both of these assets and is experienced in creating a natural result.",
        //             title2 : "Dr. Romano Explains",
        //             description2 : "It is important to note that there is a precise art to fat grafting in terms of choosing which fat to harvest, preparing it for injection, deciding how to inject and graft it, and having the ability to make it permanent.",
        //             title3 : "Related Articles & Information",
        //             description3 : "Dr. Romano has in-depth expertise in fat grafting to the face and has performed many of these operations with natural results that do not make you look like a different person but rather youthful and refreshed.",
        //             Status : "Private",
        //             icon : "face-lifting.png",
        //             images : ["face2.jpg","Face3.bmp"],
        //         });
                // await Photo_Gallary_images.create({
                //     Photo_Gallary : "677aadd296cc278bd18c55a6",
                //     name  : "Nose Beautification – Rhinoplasty",
                //     title1 : "Nose Beautification – Rhinoplasty",
                //     description1 : "Dr. Romano’s rhinoplasty plastic surgery procedure can significantly improve the appearance and proportion of your nose, enhancing facial harmony and self-confidence. Nasal surgery may also correct impaired breathing caused by structural abnormalities in the nose. His results are truly artistic, creative, and sculptured, yet the changes he makes are quite subtle and result in a “naturally” improved appearance.<br> Ethnic Rhinoplasty <br> This is a unique sub-specialization of rhinoplasty plastic surgery. He is able to address ethnic features that must be preserved and dealt with artistically. Often seen in Asian and African-American rhinoplasty procedures..",
                //     Status : "Private",
                //     icon : "nose.png",
                //     images : ["face6.bmp","face7.bmp"],
                // });
                // await Photo_Gallary_images.create({
                //     Photo_Gallary : "677aadd296cc278bd18c55a6",
                //     name  : "Brow Lift",
                //     title1 : "Brow Lift",
                //     description1 : "Dr. Romano employs a brow lift procedure to enable patients to achieve a younger, more refreshed look by smoothing the forehead, reducing frown lines, and elevating the position of the eyebrow line. His “natural”-appearing brow lift is often performed in conjunction with other cosmetic procedures to achieve a more harmonious facial appearance. A brow lift is also appropriate for treatment of certain inherited traits. Younger adults who have a low brow or who already have deep frown lines due to stress or over activity of muscles may benefit from the brow lift procedure as well.",
                //     title3 : "Related Articles & Information",
                //     description3 : "Dr. Romano has in-depth expertise in fat grafting to the face and has performed many of these operations with natural results that do not make you look like a different person but rather youthful and refreshed.",
                //     Status : "Public",
                //     icon : "face-lifting.png",
                //     images : ["face4.bmp","face5.bmp"],
                // });

                // const jwtToken = jwt.sign("1234", process.env.JWT_SECRET);
                // const jwtToken2 = jwt.sign("123", process.env.JWT_SECRET);
                // await Admins.create({
                //     name  : "Dr / Khaled",
                //     username : "khaled",
                //     password : jwtToken,                    
                //     generated_Passwords : [jwtToken2],
                // });
        const { id } = req.params;
        
        const Photo_Gallary = await Photo_Gallaries.findById(id).lean();
        const Photo_Gallaries_images = await Photo_Gallary_images.find({Photo_Gallary : id}).lean();
        const Photo_Gallariess = await Photo_Gallaries.find({}).lean();

        let rowsHtml = '';
        let rowType = 'first-row';
        let rowCount = 0;
        let maxItems = rowType === 'first-row' ? 5 : 4;
        let currentRowItems = [];

        Photo_Gallaries_images.forEach((image, index) => {
            const divClass = image.Status === 'Public' ? 'custom-div' : 'custom-div-private';

            const iconSrc = "/images/Photo Gallery/" + image.icon || '/images/default-icon.png';
            const title = image.name || 'No Title';
            const id = image._id.toString(); // or image._id.toHexString()
            const onClickAction = image.Status === 'Public'
    ? `onclick="window.location.href='/Photo_Gallary/Public_images/${id}'"`
    : `onclick="openModal('${id}')"`;

        

            const divHtml = `
                <div class="${divClass}" ${onClickAction}>
                    <img class="icons" src="${iconSrc}" alt="Icon for ${title}">
                    <p>${title}</p>
                </div>
            `;
            currentRowItems.push(divHtml);
            rowCount++;

            if (rowCount === maxItems || index === Photo_Gallaries_images.length - 1) {
                rowsHtml += `
                    <div class="custom-row ${rowType}">
                        ${currentRowItems.join('')}
                    </div>
                `;
                rowCount = 0;
                rowType = rowType === 'first-row' ? 'second-row' : 'first-row';
                maxItems = rowType === 'first-row' ? 5 : 4;
                currentRowItems = [];
            }
        });
        res.render('Pages/Photo_Gallary', {
            Photo_Gallary,
            Photo_Gallariess,
            Photo_Gallaries_images,
            rowsHtml,
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('Pages/404', { error });
    }
};


export const Public_images = async (req, res) => {
    try{
        const {id}= req.params;
        const Photo_Gallaries_images = await Photo_Gallary_images.findOne({_id : id}).lean();
        const First_Image = Photo_Gallaries_images.images[0]
    res.render('Pages/Gallery',{Photo_Gallaries_images,First_Image})
} catch (error) {
    console.error(error);
    res.status(500).render("Pages/404", { error });
}
};

export const Private_images = async (req, res) => {
    try {
        const { id, password } = req.body;

        // Retrieve the admin and passwords array
        const Admin = await Admins.findOne({ _id: "677beb3cdf0ca0c27b603c6f" }).lean();
        const passwords = Admin.generated_Passwords;

        // Decrypt passwords and check if any matches the provided password
        const isPasswordValid = passwords.some((encryptedPassword) => {
            try {
                const decryptedPassword = jwt.verify(encryptedPassword, process.env.JWT_SECRET);
                return decryptedPassword === password;
            } catch (err) {
                console.error("Failed to decrypt password:", err.message);
                return false; // Ignore invalid tokens
            }
        });

        if (isPasswordValid) {
            // Fetch gallery images and render the page
            const Photo_Gallaries_images = await Photo_Gallary_images.findOne({ _id: id }).lean();
            const First_Image = Photo_Gallaries_images.images[0];

            return res.render('Pages/Gallery', { Photo_Gallaries_images, First_Image });
        } else {
            console.log("Wrong password");
            return   res.status(204).send()
        }
    } catch (error) {
        console.error(error);
        res.status(500).render("Pages/404", { error });
    }
};

