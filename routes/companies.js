const express = require('express');
const router = new express.Router();
const {db} = require('../db');
const app = require('../app');
const ExpressError = require('../expressError');
const slugify = require('slugify');



router.get('/',async (req,res,next) => {
    try {
        const results = await db.query(`SELECT * FROM companies`);
        return res.json({companies:results.rows});
    } catch (e) {
        return next(e)
    }
})

router.get('/:code',async (req,res,next) => {
    try {
        const code = req.params.code
        console.log(code)
        const results = await db.query(`SELECT * FROM companies WHERE code = $1`,[code])
        if(results.rowCount <= 0) {
            console.log('y')
            throw new ExpressError('not found',404)
        }
        //console.log(results)
        return res.json({company:results.rows})
    } catch(e){
        next(e)
    }
})

router.post('/', async (req,res,next) => {
    try {
        let code = slugify(name, {lower: true});
        const name = req.body.name;
        const description = req.body.description;
        const result = await db.query(
            `INSERT INTO companies (code, name, description) 
             VALUES ($1, $2, $3) 
             RETURNING code, name, description`,
          [code, name, description]);
          return res.status(201).json(result.rows)
    } catch(e) {
        next(e)
    }
})

router.put('/:code', async (req,res,next) => {
    try {
        const code = req.params.code;
        const test = await db.query(`SELECT * FROM companies WHERE code = $1`,[code]);
        if (test.rowCount <= 0) {
            throw new ExpressError('not found',404)
        }
        if (req.body.name){
            db.query(`UPDATE companies SET name = $1 WHERE code = $2`,[req.body.name,code])
        }
        if(req.body.description){
            db.query(`UPDATE companies SET description = $1 WHERE code = $2`,[req.body.description,code]);
        }
        const comp = await db.query(`SELECT * FROM companies WHERE code = $1`,[code])
        
        return res.status(201).json({company:comp.rows})
    } catch(e) {
        next(e)
    }
})

router.delete('/:code', async (req,res,next) => {
    try {
        const code = req.params.code;
        const test = await db.query(`SELECT * FROM companies WHERE code = $1`,[code]);
        if (test.rowCount <= 0) {
            throw new ExpressError('not found',404)
        }
        await db.query(`DELETE FROM companies WHERE code = $1`,[code]);
        return res.json({status:"deleted"})
    }catch(e){
        next(e)
    }
})

module.exports = router