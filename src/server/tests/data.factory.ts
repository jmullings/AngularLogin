import * as faker from 'faker';
import * as _ from 'underscore';

export function account(args?: object): Test.Account {
    return _.extend({
        email: faker.internet.email().toLowerCase(),
        name: faker.name.findName(),
        password: faker.internet.password(),
    }, args);
}

export function invalidAccount(args?: object): Test.Account {
    return _.extend({
        email: faker.random.alphaNumeric().toLowerCase(),
        name: faker.random.alphaNumeric(),
        password: faker.random.alphaNumeric(),
    }, args);
}

export function emptyAccount(args?: object): Test.Account {
    return _.extend({
        email: '',
        name: '',
        password: '',
    }, args);
}
