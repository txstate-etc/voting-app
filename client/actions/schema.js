import { Schema, arrayOf } from 'normalizr';

const ideaSchema = new Schema('ideas');
const categorySchema = new Schema('categories');
const stageSchema = new Schema('stages');
const userSchema = new Schema('users');
const voteSchema = new Schema('votes');
const commentSchema = new Schema('comments');
const replySchema = new Schema('replies');
const fileSchema = new Schema('files');

commentSchema.define({
    replies: arrayOf(replySchema),
    user: userSchema
})

replySchema.define({
    user: userSchema
})

fileSchema.define({
    creator: userSchema
})

ideaSchema.define({
    creator: userSchema,
    stage: stageSchema,
    categories: arrayOf(categorySchema),
    votes: arrayOf(voteSchema),
    comments: arrayOf(commentSchema),
    files: arrayOf(fileSchema)
});

var Schemas = {ideaSchema};


export default Schemas;
