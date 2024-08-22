import { BlogCard } from "../components/BlogCard"
import { Appbar } from "../components/Appbar"
import { useBlogs } from "../hooks";
import { BlogSkeleton } from "./BlogSkeleton";
export const Blogs = () =>{
    const {loading , blogs }  = useBlogs();
    if(loading){
         
        return <div>
        <Appbar/>
        <div className="flex justify-center">

        <div>
            <BlogSkeleton/>
            <BlogSkeleton/>
            <BlogSkeleton/>
            <BlogSkeleton/>
            <BlogSkeleton/>
            <BlogSkeleton/>
            <BlogSkeleton/>
            
        </div>
        </div>
    </div>
        
    }

    

    return <div>
        <Appbar/>
        <div className="flex justify-center">

        <div className=" max-w-xl">
            {blogs.map(blog => <BlogCard
            authorName={blog.author.name || "Anonymous"}
            title={blog.title}
            content={blog.content}
            id={blog.id}
            publishedDate={"29 Dec 2002"}
        ></BlogCard>)}
        
        </div>
        </div>
    </div>
    
}

