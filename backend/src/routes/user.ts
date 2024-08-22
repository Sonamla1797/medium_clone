import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {decode , sign , verify } from 'hono/jwt'
import {signupInput} from "@sonamla_sherpa/medium-common";

export const userRoute = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string,
    
  } 
  
}>()

/* userRoute.use('/*', async (c,next) =>{
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
   */

userRoute.post('/signup', async(c)=>{
    const body = await c.req.json();
    const {success} = signupInput.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({
            message:"Inputs not correct"
        })
    }

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
    const user = await prisma.user.create({
      data:{
        email: body.email,
        password: body.password,
      },
    });
    if(!user){
      c.status(403);
      return c.json({error:"user not found"});
    }
    const token = await sign({id: user.id} , c.env.JWT_SECRET)
    
    return c.json({
      jwt:token
    })
    
  })
userRoute.post('/signin', async(c)=>{
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
    const body = await c.req.json();
    const user = await prisma.user.findUnique({
      where:{
        email: body.email,
        password: body.password,
      },
    });
    if(!user){
      c.status(403);
      return c.json({error:"user not found"});
    }
    const token = await sign({id: user.id} , c.env.JWT_SECRET)
    console.log(user);
    return c.json({
      jwt:token
    })

    
  })