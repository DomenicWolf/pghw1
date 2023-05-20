const express = require('express');
const router = new express.Router();
const {db} = require('../db');
const app = require('../app');
const ExpressError = require('../expressError');

router.get('/', async (req,res,next) => {
    try {
        const results = await db.query(`SELECT * FROM invoices`);
        return res.json({invoices:results.rows});
    } catch (e) {
        return next(e)
    }
})

router.get('/:id',async (req,res,next) => {
    try {
        const id = req.params.id;
        const results = await db.query(`SELECT * FROM invoices WHERE id = $1`, [id]);
        return res.json({invoice:results.rows});
    }catch(e) {
        next(e)
    }
})

router.post('/', async(req,res,next) => {
    try {
        let {comp_code, amt} = req.body;

        const result = await db.query(
              `INSERT INTO invoices (comp_code, amt) 
               VALUES ($1, $2) 
               RETURNING id, comp_code, amt, paid, add_date, paid_date`,
            [comp_code, amt]);
    
        return res.json({"invoice": result.rows});
    } catch(e) {
        next(e)
    }
})

router.put('/:id', async (req,res,next) => {
    try {
        const id = req.params.id;
        const test = await db.query(`SELECT * FROM invoices WHERE id = $1`, [id]);
        if (test.rowCount <= 0) {
            throw new ExpressError('not found',404);
        }
        const {amt,paid} = req.body
        const currPaidDate = test.rows[0].paid_date;

        if (!currPaidDate && paid) {
            paidDate = new Date();
        } else if (!paid) {
            paidDate = null
        } else {
            paidDate = currPaidDate;
        }
        if (amt && paid){
            db.query(`UPDATE invoices SET amt = $1, paid = $2,paid_date = $3 WHERE id = $4`,[amt,paid,paidDate,id])
        }
        console.log(paidDate)
        const inv = await db.query(`SELECT * FROM invoices WHERE id = $1`,[id])
        return res.json({invoice:inv.rows})
    } catch(e) {
        next(e)
    }
})

router.delete('/:id', async (req,res,next) => {
    try {
        const id = req.params.id;
        const inv = await db.query(`SELECT * FROM invoices WHERE id = $1`,[id]);
        if (inv.rowCount <= 0) {
            throw new ExpressError('not found',404);
        }
        await db.query(`DELETE FROM invoices WHERE id = $1`,[id])
        return res.json({status:'deleted'})
    } catch(e) {
        next(e)
    }
})


module.exports = router