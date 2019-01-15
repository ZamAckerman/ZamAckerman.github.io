#!/usr/bin/env python
# -*- coding: utf-8 -*- #

from __future__ import unicode_literals
import os
import sys
sys.path.append(os.curdir)
import os

ENVIRONMENT = os.environ.get('ENVIRONMENT', None)

# Server

RELATIVE_URLS = False

if ENVIRONMENT == 'PRODUCTION':
    SITEURL = 'https://ZamAckerman.github.io'
elif ENVIRONMENT == 'DEVELOPMENT':
    SITEURL = 'https://ZamAckerman.github.io'
else:
    SITEURL = 'https://ZamAckerman.github.io'
    RELATIVE_URLS = True

AUTHOR = 'Zam Ackerman'
AUTHOR_EMAIL = 'skielcast@gmail.com'
AUTHOR_AVATAR = r''
SITESUBTITLE = 'Zam Ackerman Personal Website'
SITENAME = 'Zam Ackerman Personal Website'
SITEIMAGE = r''
DELETE_OUTPUT_DIRECTORY = True
PATH = 'content'
TIMEZONE = 'America/Argentina/Buenos_Aires'
PAGE_ORDER_BY = 'order'

RELATED_POSTS_MAX = 3
STATIC_PATHS = [
    'blog', 'extra', ]

# Extra files

EXTRA_PATH_METADATA = {
    'extra/android-chrome-192x192.png': {'path': 'android-chrome-192x192.png'},
    'extra/android-chrome-512x512.png': {'path': 'android-chrome-512x512.png'},
    'extra/apple-touch-icon.png': {'path': 'apple-touch-icon.png'},
    'extra/apple-touch-icon.png': {'path': 'apple-touch-icon.png'},
    'extra/favicon-16x16.png': {'path': 'favicon-16x16.png'},
    'extra/favicon-32x32.png': {'path': 'favicon-32x32.png'},
    'extra/favicon.ico': {'path': 'favicon.ico'},
    'extra/mstile-150x150.png': {'path': 'mstile-150x150.png'},
    'extra/mstile-310x310.png': {'path': 'mstile-310x310.png'},
    'extra/safari-pinned-tab.svg': {'path': 'safari-pinned-tab.svg'},
    'extra/site.webmanifest': {'path': 'site.webmanifest'},
}


# Feed

FEED_DOMAIN = 'http://feeds.feedburner.com'
FEED_ALL_ATOM  = 'ZAMACK'
FEED_ATOM  = 'feeds/all.atom.xml'


# Markdown Extensions

MARKDOWN = {
    'extension_configs': {
        'markdown.extensions.codehilite': {'css_class': 'highlight '},
        'markdown.extensions.extra': {},
        'markdown.extensions.meta': {},
        'markdown.extensions.toc': {'anchorlink': True},
    },
    'output_format': 'html5',
}

# Plugins

PLUGIN_PATHS = ['plugins']
PLUGINS = [
    'pelican-ert', 'backreftranslate', 'summary', 'neighbors', 'related_posts', 
    'pelican_gist', 'pelican_githubprojects', 'render_math', 'sitemap', 
    'shortener', 'blur_thumbnails', 'service_worker', 'bundler_cache_busting'
]

GITHUB_USER = ''

SITEMAP = {
    'format': 'xml',
    'priorities': {
        'articles': 0.99,
        'indexes': 0.5,
        'pages': 0.5
    },
    'changefreqs': {
        'articles': 'daily',
        'indexes': 'daily',
        'pages': 'monthly'
    }
}

# ERT

ERT_WPM = 150
ERT_FORMAT = '{time}'

# Localization

DEFAULT_LANG = 'en'

LANG_MESSAGES = {
    'en': ['English', 'Original Version ', 'Also Translated in: '],
    'es': ['Español', 'Versión Original ', 'También traducido en: '],
    'de': ['Deutsch', 'Ursprüngliche Version ', 'Auch übersetzt in: '],
}

# Directories Layout

USE_FOLDER_AS_CATEGORY = True

# UI

DISPLAY_CATEGORIES_ON_MENU = True

# URL Settings

ARTICLE_URL = 'posts/{slug}' # Remember to Update Disqus
ARTICLE_SAVE_AS = 'posts/{slug}/index.html'

ARTICLE_LANG_URL = 'posts/{slug}/{lang}'
ARTICLE_LANG_SAVE_AS = 'posts/{slug}/{lang}/index.html'

ARCHIVES_URL = 'archives/'
ARCHIVES_SAVE_AS = 'archives/index.html'

PAGE_URL = 'pages/{slug}/'
PAGE_SAVE_AS = 'pages/{slug}/index.html'

PAGE_LANG_URL = 'pages/{slug}/{lang}'
PAGE_LANG_SAVE_AS = 'pages/{slug}/{lang}/index.html'

YEAR_ARCHIVE_SAVE_AS = 'posts/{date:%Y}/index.html'
MONTH_ARCHIVE_SAVE_AS = 'posts/{date:%Y}/{date:%b}/index.html'

TAG_URL = 'tag/{slug}/'
TAG_SAVE_AS = 'tag/{slug}/index.html'
TAGS_URL = 'tags/'
TAGS_SAVE_AS = 'tags/index.html'

AUTHOR_URL = 'author/{slug}/'
AUTHOR_SAVE_AS = 'author/{slug}/index.html'
AUTHORS_URL = 'authors/'
AUTHORS_SAVE_AS = 'authors/index.html'

CATEGORY_URL = 'category/{slug}/'
CATEGORY_SAVE_AS = 'category/{slug}/index.html'
CATEGORIES_URL = 'categories/'
CATEGORIES_SAVE_AS  = 'categories/index.html'

# Blogroll 

if ENVIRONMENT == 'PRODUCTION':
    DISQUS_SITENAME = 'zam-ackerman'
    GOOGLE_ANALYTICS = 'UA-71773079-4'
else:
    DISQUS_SITENAME = ''
    GOOGLE_ANALYTICS = ''

SOCIAL = (
    ('twitter', 'https://twitter.com/zam_ackerman'),
    ('envelope', 'mailto:zamackerman@gmail.com'),
)

# Shortener

SHORTENER_FILE = "shortener.json"
SHORTENER_FOLDER = "link"

# Cache Busting

FILES_TO_CACHE_BUSTING = (
    'js/scripts.js',
    'css/style.css',
)

# Service Worker

SERVICE_WORKER_THEMPLATE = './content/extra/sw_template.js'

# Blur Thumbnails

BLUR_PATH = './content/blog'

# Pagination

DEFAULT_PAGINATION = 10

PAGINATION_PATTERNS = (
    (1, '{base_name}/', '{base_name}/index.html'),
    (2, '{base_name}/page/{number}/', '{base_name}/page/{number}/index.html'),
)
