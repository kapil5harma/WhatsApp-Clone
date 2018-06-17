import { NgModule } from '@angular/core';
import { ChatOptionsComponent } from './chat-options/chat-options';
import { NewChatComponent } from './new-chat/new-chat';
import { MessagesOptionsComponent } from './messages-options/messages-options';
@NgModule({
	declarations: [ChatOptionsComponent,
    NewChatComponent,
    MessagesOptionsComponent],
	imports: [],
	exports: [ChatOptionsComponent,
    NewChatComponent,
    MessagesOptionsComponent]
})
export class ComponentsModule {}
