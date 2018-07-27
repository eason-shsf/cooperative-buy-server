class BillController {
    constructor() {
        this.billsList = [];
        this.inBillUsers = [];
    }

    response(ctx, data, err = 0) {
        ctx.response.body = {
            data: data,
            err: err
        };
    }

    createBill(ctx) {
        const ctxBody = ctx.request.body;
        let user = {
            'userId': ctxBody['userId'],
            'billId': ctxBody['billId'],
            'name': ctxBody['name'],
            'avatar': ctxBody['avatar']
        }
        let bill = {
            'billId': ctxBody['billId'],
            'from': ctxBody['from'],
            'to': ctxBody['to'],
            'time': ctxBody['time'],
            'members': [user]
        }
        if (this.inBillUsers.find(item => item['userId'] == ctxBody['userId'])) {
            this.response(ctx, {
                'errMsg': '用户已经在拼单中!'
            }, 1)
            return;
        }
        this.billsList.push(bill);
        this.inBillUsers.push(user);
        this.response(ctx, {
            'billsList': this.billsList,
            'inBillUsers': this.inBillUsers
        });
    }

    joinBill(ctx) {
        const ctxBody = ctx.request.body;
        let billId = ctxBody.billId;
        let user = {
            'userId': ctxBody['userId'],
            'billId': ctxBody['billId'],
            'name': ctxBody['name'],
            'avatar': ctxBody['avatar']
        }
        if (this.inBillUsers.find(item => item.userId == ctxBody.userId)) {
            this.response(ctx, {
                'errMsg': '用户已经在拼单中！'
            }, 1);
            return;
        }
        let theBill = this.billsList.find(item => item.billId == billId);
        if (!theBill) {
            this.response(ctx, {
                'errMsg': '拼单不存在'
            }, 1);
            return;
        }
        theBill.members.push(user);
        this.response(ctx, {
            'billsList': this.billsList,
            'inBillUsers': this.inBillUsers
        });
    }

    leaveBill(ctx) {
        const ctxBody = ctx.request.body;
        let billId = ctxBody.billId;
        let userId = ctxBody.userId;
        let userIndex = this.inBillUsers.findIndex(item => item.userId == userId);
        let theBillIndex = this.billsList.findIndex(item => item.billId == billId);
        if (userIndex < 0 || theBillIndex < 0) {
            this.response(ctx, {
                'errMsg': '不在拼单中，无需离开'
            }, 1);
            return;
        }
        let userInBillIndex;
        if (this.billsList[theBillIndex].members)
            userInBillIndex = this.billsList[theBillIndex].members.findIndex(item => item.userId == userId);

        this.billsList[theBillIndex].members.splice(userInBillIndex, 1);
        this.inBillUsers.splice(userIndex, 1);
        if (this.billsList[theBillIndex].members.length == 0) {
            //handle image;
            this.billsList.splice(theBillIndex, 1);
        }
        this.response(ctx, {
            billsList: this.billsList,
            inBillUsers: this.inBillUsers
        });
    }



    getBill(ctx) {
        const ctxBody = ctx.request.body;
        let billId = ctxBody.billId;
        let bill = this.billsList.find(item => item.billId == billId);
        if (!bill) {
            this.response(ctx, {
                'errMsg': '拼单不存在！',
                'billsList': this.billsList,
            }, 1);
        } else {
            this.response(ctx, bill, 0);
        }
    }

    inBill(ctx) {
        const ctxBody = ctx.request.body;
        const userId = ctxBody.userId;
        const inUser = this.inBillUsers.find(item => item.userId == userId);
        if (inUser) {
            this.response(ctx, {
                inBill: inUser,
                billsList: this.billsList,
                inBillUsers: this.inBillUsers
            })
        } else {
            this.response(ctx, {
                inBill: false,
                billsList: this.billsList,
                inBillUsers: this.inBillUsers
            })
        }
    }
}

module.exports = BillController