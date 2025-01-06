import blog from "../DB Models/Blog.js"
import Photo_Gallaries from "../DB Models/Photo_Gallary.js"

export const index = async (req, res) => {
    try {

        const Photo_Gallary = await Photo_Gallaries.find({}).lean();


        res.render('Pages/Read_more', {  Photo_Gallary })
    } catch (error) {
        console.error(error);
        res.status(500).render("Pages/404", { error });
    }
};


export const blog_back = async (req, res) => {
    try {
        const {id} = req.params;

        const blogs = await blog.find({Category: id}).lean();
        const All_Blogs = await blog.find({}).lean();
        const groupedBlogs = blogs.reduce((acc, currentBlog) => {
            const { Category } = currentBlog;
            if (!acc[Category]) {
                acc[Category] = [];
            }
            acc[Category].push(currentBlog);
            return acc;
        }, {});

        // Fetch the latest 5 blogs, sorted by creation date
        const latestBlogs = await blog
            .find({})
            .sort({ createdAt: -1 }) // Sort by creation date in descending order
            .limit(5) // Limit the result to 5 blogs
            .lean();


        const  Photo_Gallary= await Photo_Gallaries.find({}).lean();
        res.render('Pages/Blog', { groupedBlogs,Photo_Gallary,latestBlogs });
    } catch (error) {
        console.error(error);
        res.status(500).render("Pages/404", { error });
    }
};
