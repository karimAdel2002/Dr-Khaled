import Contact from "../DB Models/Contact.js"
import Photo_Gallaries from "../DB Models/Photo_Gallary.js"

export const index = async (req, res) => {
    try{
        const  Photo_Gallary= await Photo_Gallaries.find({}).lean();
    res.render('Pages/Contact',{Photo_Gallary})
} catch (error) {
    console.error(error);
    res.status(500).render("Pages/404", { error });
}
};
export const Save = async (req, res) => {
    try{
        const { name,email,phone,procedures,questions} = req.body;
         await Contact.create({
            name,
            email,
            phone,
            procedures,
            questions
        });
         res.redirect('/Contact')
} catch (error) {
    console.error(error);
    res.status(500).render("Pages/404", { error });
}
};
