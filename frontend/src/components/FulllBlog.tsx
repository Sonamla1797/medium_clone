import { Appbar } from "./Appbar"
import { Blog } from "../hooks"
import { Avatar } from "./BlogCard"
export const FullBlog = ({blog}: {blog: Blog}) =>{
    return <div>
        <Appbar/>
        <div className="flex justify-center">
            <div className="grid grid-cols-12 px10 w-full pt-200 max-w-screen-xl pt-12">
            <div className="col-span-8">
                <div className="text-5xl font-extrabold">
                    {blog.title}
                </div>
                <div className="text-slate-200">
                    Post on 2ndDecember 2023
                </div>
                <div>
                    {blog.content}
                </div>
            </div>
            <div className="col-span-4">
                <div className="text-slate-600 text-lg ">
                    Author
                </div>
                <div className="flex w-full">
                    <div className="pr-4 flex flex-col justify-center">
                    <Avatar name={blog.author.name || "Anonymous"} size="big"/>
                    </div>
                    <div>
                        <div className="text-xl font-bold">
                            {blog.author.name|| "Anonymous"}    
                        </div>
                        
                        <div className="pt-2 text-slate-500">
                            Random ability of author to grab attention of the user
                        </div>       
                    </div>                                                       
                </div>
               
            </div>


        </div>
        </div>
    </div>
}