import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {decode , sign , verify } from 'hono/jwt'

export const blogRoute = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string,
    
  } ,
  Variables:{
    userId: string;
  }
}>()

blogRoute.use('/*', async (c,next) =>{
    try{
        const authHeader = c.req.header("authorization") || "";
  
        const user = await verify(authHeader,c.env.JWT_SECRET);
        if(user){
          c.set("userId", String(user.id));
          await next();
      
        }
        else{ 
          c.status(403)
          return c.json({error:"unauthorized"})
        }
    }catch{
        c.status(403);
        return c.json({
            message:"You are not logged in"
        })
    }
  })
  

blogRoute.post('/', async (c)=>{
    const body = await c.req.json();
    const authorId = c.get("userId");
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const blog = await prisma.blog.create({
        data:{
            title: body.title,
            content: body.content,
            authorId: authorId,
        }
    })
    return c.json({
        id: blog.id
    })
  })
blogRoute.put('/', async(c)=>{
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const blog = await prisma.blog.update({
        where:{
            id:body.id
        },
        data:{
            title: body.title,
            content: body.content,
        }
    })
    return c.json({
        id: blog.id
    })
  })
  //Todo: add pagination
  blogRoute.get('/bulk', async (c) =>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const blogs = await prisma.blog.findMany({
        select:{
            content: true,
            title: true,
            id: true,
            author: {
                select:{
                    name:true
                }
            }
        }
    });
    return c.json({
        blogs
    })
  })
blogRoute.get('/:id', async(c)=>{
    const id =  c.req.param("id");
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try{
        const blog = await prisma.blog.findFirst({
            where:{
                id: id
            },
            select:{
                title: true,
                content: true,
                author:{
                    select:{
                        name: true,
                    }
                }
            }
        })
        return c.json({
            blog
        })
    }
    catch(e){
        c.status(411);
        return c.json({
            message: "Error while fetching blog post"
        })
    }
  })


  //Todo: add pagination
  blogRoute.get('/bulk', async (c) =>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const blogs = await prisma.blog.findMany();
    return c.json({
        blogs
    })
  })