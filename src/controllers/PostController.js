const Post = require('../models/Post');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

class PostController {
  async index(req, res) {
    try {
      if (req.params.id) {
        const post = await Post.findById(req.params.id);

        if (!post) {
          throw Error('Post not exists.');
        }

        return res.send(post);
      }

      const posts = await Post.find().sort('-createdAt');
      return res.send(posts);
    } catch (e) {
      return res.status(400).send({
        error: true,
        message: e.message,
      });
    }
  }

  async store(req, res) {
    const replaceExtension = text => text.replace(/.png|.jpeg|.gif|.jpg/i, 'resize.jpg');

    try {
      if (!req.body.author) {
        throw Error('Author é obrigatório.');
      }

      if (!req.body.place) {
        throw Error('Place é obrigatório.');
      }

      if (!req.body.description) {
        throw Error('Descrição é obrigatório.');
      }

      if (!req.file) {
        throw Error('Imagem é obrigatório.');
      }

      console.log(req.file);

      // Resized image
      await sharp(req.file.path)
        .resize(500)
        .jpeg({ quality: 70 })
        .toFile(
          replaceExtension(req.file.path),
        );

      fs.unlinkSync(req.file.path);

      const post = await Post.create({
        ...req.body,
        image: replaceExtension(
          req.file.hash,
        ),
      });

      req.io.emit('post', post);

      return res.send(post);
    } catch (e) {
      return res.status(400).send({
        error: true,
        message: e.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        throw Error('Post not exists.');
      }

      const image = path.resolve(__dirname, '..', '..', 'uploads', post.image);

      await fs.access(image, err => {
        if (!err) {
          fs.unlinkSync(image);
        }
      });

      await post.delete();

      req.io.emit('delete', post);

      return res.send(post);
    } catch (e) {
      return res.status(400).send({
        error: true,
        message: e.message,
      });
    }
  }

  async like(req, res) {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        throw Error('Post not exists.');
      }

      post.likes += 1;
      await post.save();

      req.io.emit('like', post);

      return res.send(post);
    } catch (e) {
      return res.status(400).send({
        error: true,
        message: e.message,
      });
    }
  }

  async clear(req, res) {
    const posts = await Post.find();

    if (posts) {
      posts.forEach(async post => {
        const image = path.resolve(
          __dirname,
          '..',
          '..',
          'uploads',
          post.image,
        );

        await fs.access(image, err => {
          if (!err) {
            fs.unlinkSync(image);
          }
        });

        await post.delete();
      });
    }

    return res.send({ success: true });
  }
}

module.exports = new PostController();
